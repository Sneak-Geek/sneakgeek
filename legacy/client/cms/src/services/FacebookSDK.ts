//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { IFacebookSDK, LoginResult, Permissions } from "business";

export class FacebookSdk implements IFacebookSDK {
  public async loginWithPermission(permissions: Permissions[]): Promise<LoginResult> {
    return new Promise<LoginResult>((resolve, reject) => {
      FB.login(
        response => {
          response.status === "connected" ? resolve({ isCancelled: false, error: undefined }) : reject();
        },
        { scope: permissions.join(",") }
      );
    });
  }

  public getCurrentAccessToken(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      FB.getLoginStatus(response => {
        response.status === "connected" ? resolve(response.authResponse.accessToken) : reject();
      });
    });
  }
}
