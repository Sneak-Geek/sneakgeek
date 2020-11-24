// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { UserAccount, Verification, AccessLevel } from "../../database";
import PassportFacebookToken from "passport-facebook-token";

export interface AccountUpdateInput {
  profile?: string;
  isVerified?: boolean;
  accessLevel?: AccessLevel;
  password?: string;
}

export interface IAccountDao {
  findById(accountId: string): Promise<UserAccount | undefined>;
  findByProviderId(providerId: string): Promise<UserAccount | undefined>;
  findByProviderEmail(providerEmail: string): Promise<UserAccount | undefined>;
  findByVerificationToken(verificationToken: string): Promise<UserAccount | undefined>;
  createVerification(accountId: string): Promise<Verification>;
  createFacebookAccount(profile: PassportFacebookToken.Profile): Promise<UserAccount>;
  createEmailAccount(email: string, password: string): Promise<UserAccount>;
  createAppleAccount(accountId: string): Promise<UserAccount>;
  destroyById(accountId: string): Promise<UserAccount | undefined>;
  updateById(
    accountId: string,
    update: AccountUpdateInput
  ): Promise<UserAccount | undefined>;
}
