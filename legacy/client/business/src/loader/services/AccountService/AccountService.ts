//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { IAccountService } from "./IAccountService";
import { AuthProvider } from "../../../types";
import { Account, Profile, BalanceHistory, BalanceHistoryStatus } from "../../../model";
import { BaseService } from "../BaseService";
import HttpStatus from "http-status";

export class AccountService extends BaseService implements IAccountService {
  public async emailAuth(
    email: string,
    password: string,
    isSignUp: boolean = false
  ): Promise<{ account: Account; token: string } | undefined> {
    const endpoint = isSignUp ? `/account/auth/email/signup` : `/account/auth/email/login`;
    const response = await this.apiClient.getInstance().post(
      endpoint,
      { email, password },
      {
        headers: {
          "Access-Control-Request-Method": "POST",
        },
      }
    );

    if (
      response &&
      (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)
    ) {
      return response.data;
    }

    return undefined;
  }

  public async login(
    token: string,
    provider: AuthProvider
  ): Promise<{ account: Account; token: string } | undefined> {
    const headers = { access_token: token };
    const response = await this.apiClient
      .getInstance()
      .post(`/account/auth/${provider}`, {}, { headers });
    {
    }
    if (
      response &&
      (response.status === HttpStatus.CREATED || response.status === HttpStatus.OK)
    ) {
      return response.data;
    }

    return undefined;
  }

  public async getCurrentUser(
    accessToken: string
  ): Promise<{ account: Account } | undefined> {
    const headers = { authorization: accessToken };
    const response = await this.apiClient.getInstance().get(`/account`, { headers });

    if (response && response.status === HttpStatus.OK) {
      return response.data;
    }

    return undefined;
  }

  public async getUserProfile(accessToken: string): Promise<Profile | undefined> {
    const headers = { authorization: accessToken };
    const response = await this.apiClient.getInstance().get("/profile", { headers });

    if (response && response.status === HttpStatus.OK) {
      return response.data.profile;
    }

    return undefined;
  }

  public async updateProfile(token: string, profile: Partial<Profile>): Promise<Profile> {
    const response = await this.apiClient.getInstance().put("/profile/update", profile, {
      headers: {
        authorization: token,
      },
    });

    return response.data.profile as Profile;
  }

  public getForgotPasswordToken(email: string): Promise<string> {
    return this.apiClient.getInstance().post("/account/send-confirmation-token", { email });
  }

  public verifyForgotPasswordToken(token: string): Promise<string> {
    return this.apiClient.getInstance().post("/account/verify-token", { token });
  }

  public resetPassword(newPassword: string, token: string): Promise<string> {
    return this.apiClient.getInstance().patch("/account/set-password", { newPassword, token });
  }

  public async getNotifications(token: string): Promise<string> {
    const response = await this.apiClient.getInstance().get("/notification", {
      headers: {
        authorization: token
      }
    });

    return response.data.notifications;
  }

  public async getBalanceHistories(token: string, action?: string, status?: string): Promise< Array<BalanceHistory>> {
    let url = `/balance-history/`;
    if(action && status){
      url += `?action=${action}&status=${status}`
    }else if(action){
      url += `?action=${action}`
    }else if(status){
      url += `?status=${status}`
    }

    const response = await this.apiClient.getInstance().get(url, {
      headers: {
        authorization: token
      }
    });
    return response.data;
  }

  public async getBalanceHisotiresForAdmin(token: string): Promise<Array<BalanceHistory>>{
    const response = await this.apiClient.getInstance().get(`/balance-history/admin`, {
      headers: {
        authorization: token
      }
    });
    return response.data;
  }

  public async createProcessingWithdrawal(token: string,amount: number, bankName: string, accountNumber: string, accountHolderName: string): Promise<void>{
     return this.apiClient.getInstance().post(`/balance-history/withdraw/`,{amount, bankName, accountNumber, accountHolderName} ,{
      headers: {
        authorization: token
      }
    });
  }

  public async updateWithdrawalStatusForAdmin(token: string, status: BalanceHistoryStatus, balanceHistoryId: string): Promise<void>{
    return await this.apiClient.getInstance().post(`/balance-history/update-balance-history`, {status, balanceHistoryId} ,{
      headers: {
        authorization: token
      }
    });
  }
}
