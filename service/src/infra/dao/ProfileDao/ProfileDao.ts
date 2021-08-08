// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { IProfileDao, ProfileUpdateInput } from "./IProfileDao";
import { UserProfile, UserAccount, Repository } from "../../database";
import { inject, injectable } from "inversify";
import { Types } from "../../../configuration/inversify";
import { INotificationService } from "../../services";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

@injectable()
export class ProfileDao implements IProfileDao {
  @inject(Types.ProfileRepository)
  private readonly profileRepo!: Repository<UserProfile>;

  public async createByUserAccount(account: UserAccount): Promise<UserProfile> {
    return await this.profileRepo.create({
      accountId: account._id,
      userProvidedName: account.accountNameByProvider
        ? {
            firstName: account.accountNameByProvider.givenName || "",
            middleName: account.accountNameByProvider.middleName || "",
            lastName: account.accountNameByProvider.familyName || "",
          }
        : {},
      userProvidedGender: account.accountGenderByProvider
        ? account.accountGenderByProvider
        : "",
      userProvidedEmail: account.accountEmailByProvider
        ? account.accountEmailByProvider
        : "",
    });
  }

  public async findById(profileId: string | ObjectId): Promise<UserProfile | undefined> {
    return await this.profileRepo.findById(profileId).exec();
  }

  public async findByAccountId(accountId: string): Promise<UserProfile | undefined> {
    return await this.profileRepo.findOne({ accountId }).exec();
  }

  public async registerDeviceForPushNotification(
    profileId: string,
    installationId: string,
    platform: string,
    pushChannel: string
  ): Promise<UserProfile | undefined> {
    return await this.profileRepo
      .findOneAndUpdate(
        {
          _id: profileId,
          "notificationSetting.registeredDevices.pushChannel": {
            $ne: pushChannel,
          },
        },
        {
          $push: {
            "notificationSetting.registeredDevices": {
              installationId,
              platform,
              pushChannel,
            },
          },
        },
        { new: true }
      )
      .exec();
  }

  public async updateById(
    profileId: string,
    update: ProfileUpdateInput
  ): Promise<UserProfile | undefined> {
    return await this.profileRepo
      .findOneAndUpdate(
        { _id: profileId },
        {
          favoriteShoeBrand: update.favoriteShoeBrand,
          shoeSizeStandard: update.shoeSizeStandard,
          userProvidedAddress: update.userProvidedAddress, // this should never be updated partially
          userProvidedGender: update.userProvidedGender,
          userProvidedPhoneNumber: update.userProvidedPhoneNumber,
          userProvidedShoeSize: update.userProvidedShoeSize,
          userProvidedEmail: update.userProvidedEmail,
          "userProvidedName.firstName": update.userProvidedName
            ? update.userProvidedName.firstName
            : undefined,
          "userProvidedName.middleName": update.userProvidedName
            ? update.userProvidedName.middleName
            : undefined,
          "userProvidedName.lastName": update.userProvidedName
            ? update.userProvidedName.lastName
            : undefined,
          userProvidedProfilePic: update.userProvidedProfilePic,
        },
        { new: true, omitUndefined: true }
      )
      .exec();
  }

  public markNotificationsRead(profileId: ObjectId, notificationIds: string[]) {
    return this.profileRepo
      .updateMany(
        {
          _id: profileId,
          "notifications._id": {
            $in: notificationIds.map(mongoose.Types.ObjectId),
          },
        },
        {
          $set: {
            "notifications.isRead": true,
          },
        }
      )
      .exec();
  }

  public async findByFirebaseAccountId(uid: string): Promise<UserProfile | undefined> {
    return this.profileRepo.findOne({ firebaseAccountId: uid }).exec();
  }

  public async createUserWithFirebaseAccountId({
    firebaseAccountId,
    userProvidedEmail,
  }: {
    firebaseAccountId: string;
    userProvidedEmail?: string;
  }): Promise<UserProfile | undefined> {
    return this.profileRepo.create({ firebaseAccountId, userProvidedEmail });
  }
}
