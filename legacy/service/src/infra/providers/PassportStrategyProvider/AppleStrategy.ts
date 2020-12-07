import { Strategy } from "passport";
import { Request } from "express";
import HttpStatus from "http-status";
import { Types, container } from "../../../configuration/inversify";
import { IAppleAuthService } from "../../../infra/services";
import { UserAccount } from "../../../infra/database";

export type AppleStrategyCallback = (
  userId: string,
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
    if (!req.headers["access_token"] || typeof req.headers["access_token"] !== "string") {
      this.fail(HttpStatus.UNAUTHORIZED);
    } else {
      const token = req.headers["access_token"];
      try {
        const userToken = (await this.appleAuthService.getUserToken(token)).sub;

        this.callback(userToken, this._onVerified.bind(this));
      } catch (error) {
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
