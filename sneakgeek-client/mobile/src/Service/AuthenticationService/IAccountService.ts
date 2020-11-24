//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Account, Profile } from "../../Shared/Model";
import { SetPasswordPayload, ChangePasswordPayload } from "../../Shared/Payload";

export type AuthProvider = "facebook" | "google";
export type AccountPayload = { user: Account; token: string };

export interface IAccountService {
  login(token: string, provider: AuthProvider): Promise<AccountPayload | undefined>;
  getCurrentUser(accessToken: string): Promise<AccountPayload | undefined>;
  getUserProfile(accessToken: string): Promise<Profile | undefined>;
  updateUserProfile(accessToken: string, newProfile: Partial<Profile>): Promise<boolean>;
  addOnwedShoes(
    accessToken: string,
    shoeId: string,
    owned: Array<{ shoeSize: string; number: number }>
  ): Promise<boolean>;
  signupEmail(email: string, password: string): Promise<AccountPayload | undefined>;
  loginEmail(email: string, password: string): Promise<AccountPayload | undefined>;
  requestConfirmationToken(email: string): Promise<any>;
  verifyConfirmationToken(email: string, token: string): Promise<any>;
  setNewPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<(SetPasswordPayload & { user?: Account }) | undefined>;
  isAccountWithEmailExists(emai: string): Promise<any>;
  changePassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<ChangePasswordPayload | undefined>;
}
