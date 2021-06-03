import { Strategy } from "passport";
import { Request } from "express";
import HttpStatus from "http-status";
import { Types, container } from "../../../configuration/inversify";
import { IAppleAuthService } from "../../../infra/services";
import { UserAccount } from "../../../infra/database";
import { LogProvider } from "../LogProvider";

export type AppleStrategyCallback = (
  userInfo: {userId: string, email: string},
  callback: (error: any, account: UserAccount) => any
) => void;

export class AppleStrategy extends Strategy {
  private appleAuthService!: IAppleAuthService;

  private callback: AppleStrategyCallback;

  public constructor(callback: AppleStrategyCallback) {
    super();
    this.callback = callback;
    this.name = "apple-strategy";
    this.appleAuthService = container.get<IAppleAuthService>(Types.AppleAuthService);
  }

  public async authenticate(req: Request, _?: any) {
    if (!req.headers["access_token"] && !req.body["access_token"]) {
      LogProvider.instance.error(
        `Error getting token from Apple\n
        ${JSON.stringify(req.headers, null, 2)}\n
        ${JSON.stringify(req.body, null, 2)}`
      );
      this.fail(HttpStatus.UNAUTHORIZED);
    } else {
      const tokenHeader = (req.headers["access_token"] || req.body["access_token"]) as string;
      const [email, token] = tokenHeader.split("+");
      try {
        const userId = (await this.appleAuthService.getUserToken(token)).sub;

        this.callback({userId, email}, this._onVerified.bind(this));
      } catch (error) {
        LogProvider.instance.error(`Error authenticate with Apple\n${error.stack}`);
        this.fail(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  private _onVerified(error: any, account: UserAccount) {
    if (error) {
      return this.fail(error, null);
    } else if (!account) {
      return this.fail(HttpStatus.UNAUTHORIZED);
    }

    this.success(account);
  }
}
