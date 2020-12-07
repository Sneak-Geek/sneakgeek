//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import jwt, { DecodeOptions } from "jsonwebtoken";
import { JwtPayload } from "../../../../types";
import { injectable, inject } from "inversify";
import { ClientToken } from "../AppleAuthService";
import { EnvironmentProvider } from "../../providers";

@injectable()
export class JwtService {
  private readonly crypt: string = "HS256";

  public verifyJWToken<T extends ClientToken | JwtPayload>(
    token: string,
    key: string = EnvironmentProvider.env.JwtSecret,
    algorithm: string = this.crypt
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      jwt.verify(
        token,
        key,
        {
          algorithms: [algorithm],
        },
        (err, decoded) => {
          return err || !decoded ? reject(err) : resolve(decoded as T);
        }
      );
    });
  }

  public createJWToken(accountId: string): string {
    const maxAge = `${EnvironmentProvider.env.JwtMaxAge}d`;
    const secret = EnvironmentProvider.env.JwtSecret;

    const payload: JwtPayload = { accountId };
    let token = jwt.sign(payload, secret, {
      expiresIn: maxAge,
      algorithm: this.crypt,
    });

    return token;
  }

  public decode(token: string, options?: DecodeOptions): string | { [key: string]: any } {
    return jwt.decode(token, options);
  }
}
