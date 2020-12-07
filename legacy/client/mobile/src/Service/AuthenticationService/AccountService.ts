// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import ApiClient from "../ApiClient";
import * as HttpStatus from "http-status";
import { IAccountService, AuthProvider, AccountPayload } from "./IAccountService";
import { injectable } from "inversify";
import { Profile, Account } from "../../Shared/Model";
import { SetPasswordPayload, ChangePasswordPayload } from "../../Shared/Payload";

@injectable()
export class AccountService implements IAccountService {
  public async /** override */ setNewPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<(SetPasswordPayload & { user?: Account }) | undefined> {
    const response = await ApiClient.put("/account/set-user-password", {
      email,
      token,
      newPassword
    });
    if (response && response.status === HttpStatus.OK) {
      return response.data;
    }

    return undefined;
  }

  public async /** override */ changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordPayload | undefined> {
    const headers = { authorization: token };
    const response = await ApiClient.patch(`/account/change-password`, { currentPassword, newPassword }, { headers });

    if (response && (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)) {
      return response.data;
    }

    return undefined;
  }

  public async verifyConfirmationToken(email: string, token: string): Promise<any | undefined> {
    const response = await ApiClient.post(`/account/verify-token`, { email, token });
    if (response && (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)) {
      return response.data;
    }

    return undefined;
  }

  public async requestConfirmationToken(email: string): Promise<any | undefined> {
    const response = await ApiClient.post(`/account/send-confirmation-token`, { email });
    if (response && (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)) {
      return response.data;
    }

    return undefined;
  }

  public async signupEmail(email: string, password: string): Promise<AccountPayload | undefined> {
    const response = await ApiClient.post(`/account/email-signup`, { email, password });

    if (response && (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)) {
      return response.data as AccountPayload;
    }

    return undefined;
  }

  public async loginEmail(email: string, password: string): Promise<AccountPayload | undefined> {
    const response = await ApiClient.post(`/account/email-login`, { email, password });

    if (response && (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)) {
      return response.data as AccountPayload;
    }

    return undefined;
  }

  public async /** override */ login(token: string, provider: AuthProvider): Promise<AccountPayload | undefined> {
    const headers = { access_token: token };
    const response = await ApiClient.post(`/account/${provider}`, {}, { headers });

    if (response && (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)) {
      return response.data as AccountPayload;
    }

    return undefined;
  }

  public async /** override */ getCurrentUser(accessToken: string): Promise<AccountPayload | undefined> {
    const headers = { authorization: accessToken };
    const response = await ApiClient.get(`/account/`, { headers });
    if (response && response.status === HttpStatus.OK) {
      return response.data as AccountPayload;
    }

    return undefined;
  }

  public async /** override */ isAccountWithEmailExists(email: string): Promise<any | undefined> {
    const response = await ApiClient.get(`/account/email-exists?email=${email}`);
    if (response && response.status === HttpStatus.OK) {
      return response.data;
    }

    return undefined;
  }

  public async /** override */ addOnwedShoes(
    accessToken: string,
    shoeId: string,
    owned: Array<{ shoeSize: string; number: number }>
  ): Promise<boolean> {
    const headers = { authorization: accessToken };
    const response = await ApiClient.put(`/profile/own`, { shoeId, owned }, { headers });
    if (response && response.status === HttpStatus.OK) {
      return true;
    }

    return false;
  }

  public async /** override */ getUserProfile(accessToken: string): Promise<Profile | undefined> {
    const headers = { authorization: accessToken };
    const response = await ApiClient.get("/profile", { headers });
    if (response && response.status === HttpStatus.OK) {
      return response.data;
    }

    return undefined;
  }

  public async /** override */ updateUserProfile(accessToken: string, newProfile: Partial<Profile>): Promise<boolean> {
    const headers = { authorization: accessToken };
    const response = await ApiClient.put("/profile/update", newProfile, { headers });

    if (response && response.status === HttpStatus.OK) {
      return true;
    }

    return false;
  }
}
