//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { AuthProvider, Profile, Account, BalanceHistory, BalanceHistoryStatus } from "../../../model";

export interface IAccountService {
  login(
    token: string,
    provider: AuthProvider
  ): Promise<{ account: Account; token: string } | undefined>;
  emailAuth: (
    email: string,
    password: string,
    isSignUp: boolean
  ) => Promise<{ account: Account; token: string } | undefined>;
  getCurrentUser(
    accessToken: string
  ): Promise<{ account: Account } | undefined>;
  getUserProfile(accessToken: string): Promise<Profile | undefined>;
  updateProfile(token: string, userProfile: Partial<Profile>): Promise<Profile>;
  getForgotPasswordToken(email: string): Promise<string>;
  verifyForgotPasswordToken(token: string): Promise<string>;
  resetPassword(newPassword: string, token: string): Promise<string>;
  getBalanceHistories(asscessToken: string, action?: string, status?: string): Promise< Array<BalanceHistory>>;
  getBalanceHisotiresForAdmin(token: string): Promise<Array<BalanceHistory>>;
  createProcessingWithdrawal(token: string,amount: number, bankName: string, accountNumber: string, accountHolderName: string):Promise<void>;
  updateWithdrawalStatusForAdmin(token: string, status: BalanceHistoryStatus, balanceHistoryId: string): Promise<void>;
}
