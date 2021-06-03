import { BaseExternalApiService } from "../BaseExternalApiService";
import { injectable, inject } from "inversify";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { IAppleAuthService, ClientToken } from "./IAppleAuthService";
import { Types } from "../../../configuration/inversify";
import { IJwtService } from "../JwtService";
import NodeRsa from "node-rsa";
import { EnvironmentProvider } from "../../providers";
import FormData from "form-data";

type AppleJWKSetKey = {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
};

type AppleTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  token_type: "bearer";
};

enum AuthScheme {
  AUTHORIZATION = "authorization_code",
  VALIDATION = "refresh_token",
}

@injectable()
export class AppleAuthService extends BaseExternalApiService implements IAppleAuthService {
  private readonly clientId = EnvironmentProvider.env.AppleBundleId;
  private readonly authKey = path.join(process.cwd(), "resources", "certificates", "AuthKey_TWRTMUPS5C.p8");
  private readonly keyIdentifier = EnvironmentProvider.env.AppleKeyId;
  private readonly hostname = EnvironmentProvider.env.Host;
  private readonly snkgTeamId = EnvironmentProvider.env.AppleTeamId;
  private readonly appleAuthorityUrl = "https://appleid.apple.com";
  private readonly signingAlgorithm = "ES256";

  @inject(Types.JwtService)
  private readonly jwtService!: IJwtService;

  public constructor() {
    super();
  }

  public async getApplePublicKey(): Promise<AppleJWKSetKey[]> {
    const result = await this.apiClient.get(`${this.appleAuthorityUrl}/auth/keys`);

    return result.data.keys;
  }

  public async authorizeAppleUser(authCode: string): Promise<AppleTokenResponse> {
    const body = new FormData();
    const clientSecret = this._getClientSecret();
    console.log(clientSecret);
    body.append('client_id', this.clientId);
    body.append('client_secret', clientSecret);
    body.append('code', authCode);
    body.append('grant_type', AuthScheme.AUTHORIZATION);

    const result = await this.apiClient.post(
      `${this.appleAuthorityUrl}/auth/token`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return result.data;
  }

  public async verifyRefreshToken(refreshToken: string): Promise<AppleTokenResponse> {
    const result = await this.apiClient.post(
      `${this.appleAuthorityUrl}/auth/token`,
      {
        client_id: this.clientId,
        client_secret: this._getClientSecret(),
        refresh_token: refreshToken,
        grant_type: AuthScheme.VALIDATION,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return result.data;
  }

  private _getClientSecret(): string {
    const secretGenerationTime = new Date();
    const secretExpireTime = new Date(secretGenerationTime);
    secretExpireTime.setMonth(secretGenerationTime.getMonth() + 6);

    const secretBody = {
      iss: this.snkgTeamId,
      iat: secretGenerationTime.getTime(),
      exp: secretExpireTime.getTime(),
      aud: this.appleAuthorityUrl,
      sub: this.clientId,
    };
    const secretHeader = {
      alg: this.signingAlgorithm,
      kid: this.keyIdentifier,
    };

    const key = fs.readFileSync(this.authKey);

    // sign with key and returning JWT token
    return jwt.sign(secretBody, key, {
      algorithm: this.signingAlgorithm,
      header: secretHeader,
    });
  }

  public async getUserToken(idToken: string): Promise<ClientToken> {
    const appleKeys = await this.getApplePublicKey();
    const decodedToken = this.jwtService.decode(idToken, {
      complete: true,
    }) as { [key: string]: any };
    const keyId = decodedToken.header.kid;
    const key = appleKeys.find((k) => k.kid === keyId);

    const publicKey = new NodeRsa();
    publicKey.importKey(
      {
        n: Buffer.from(key.n, "base64"),
        e: Buffer.from(key.e, "base64"),
      },
      "components-public"
    );
    const userKey = publicKey.exportKey("public");

    return this.jwtService.verifyJWToken<ClientToken>(idToken, userKey, "RS256");
  }
}
