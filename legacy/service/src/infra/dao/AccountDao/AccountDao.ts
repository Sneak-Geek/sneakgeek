// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import { IAccountDao, AccountUpdateInput } from "./IAccountDao";
import {
  Repository,
  UserAccount,
  Verification,
  UserProfile,
  AccountProvider,
} from "../../database";
import { Types } from "../../../configuration/inversify";
import PassportFacebookToken from "passport-facebook-token";
import crypto from "crypto";
import mongoose from "mongoose";

@injectable()
export class AccountDao implements IAccountDao {
  @inject(Types.AccountRepository)
  private readonly accountRepo!: Repository<UserAccount>;

  @inject(Types.VerificationRepository)
  private readonly verificationRepo!: Repository<Verification>;

  @inject(Types.ProfileRepository)
  private readonly profileRepo!: Repository<UserProfile>;

  public async findById(accountId: string): Promise<UserAccount | undefined> {
    return await this.accountRepo.findById(accountId).exec();
  }

  public async findByProviderId(providerId: string): Promise<UserAccount | undefined> {
    return await this.accountRepo.findOne({ accountIdByProvider: providerId }).exec();
  }

  public async findByProviderEmail(
    providerEmail: string
  ): Promise<UserAccount | undefined> {
    return await this.accountRepo.findOne({ accountEmailByProvider: providerEmail }).exec();
  }

  public async findByVerificationToken(
    verificationToken: string
  ): Promise<UserAccount | undefined> {
    const verification = await this.verificationRepo.findOne({ verificationToken }).exec();
    if (!verification) {
      return undefined;
    } else {
      return await this.findById(verification.userAccountId);
    }
  }

  public async createVerification(accountId: string): Promise<Verification> {
    const verificationToken = crypto.randomBytes(16).toString("hex");
    return await this.verificationRepo.create({
      verificationToken,
      userAccountId: accountId,
    });
  }

  public async createFacebookAccount(
    profile: PassportFacebookToken.Profile
  ): Promise<UserAccount> {
    return await this.accountRepo.create({
      accountProvider: "facebook",
      accountIdByProvider: profile.id,
      accountNameByProvider: profile.name,
      accountGenderByProvider: profile.gender,
      accountEmailByProvider: profile.emails[0].value,
      accountProfilePicByProvider:
        profile.photos && profile.photos.length > 0 ? profile.photos[0].value : undefined,
    });
  }

  public async createEmailAccount(email: string, password: string): Promise<UserAccount> {
    return await this.accountRepo.create({
      accountProvider: "email",
      accountIdByProvider: email,
      accountEmailByProvider: email,
      password: password,
    });
  }

  public async destroyById(accountId: string): Promise<UserAccount | undefined> {
    let account: UserAccount | undefined;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      account = await this.accountRepo.findOneAndDelete({ _id: accountId }).exec();
      if (account && account.profile) {
        await this.profileRepo.findOneAndDelete({ _id: account.profile }).exec();
      }
      await session.commitTransaction();
      return account;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  public async updateById(
    accountId: string,
    update: AccountUpdateInput
  ): Promise<UserAccount | undefined> {
    return this.accountRepo
      .findOneAndUpdate(
        { _id: accountId },
        {
          profile: update.profile,
          isVerified: update.isVerified,
          accessLevel: update.accessLevel,
          password: update.password,
        },
        { new: true, omitUndefined: true }
      )
      .exec();
  }

  public async createAppleAccount(userId: string) {
    return this.accountRepo.create({
      accountProvider: AccountProvider.apple,
      accountIdByProvider: userId,
    });
  }
}
