// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { UserProfile, Notification, UserAccount } from "../../database";
import { ObjectId } from "mongodb";

export interface ProfileUpdateInput {
  favoriteShoeBrand?: string;
  shoeSizeStandard?: string;
  userProvidedAddress?: {
    streetAddress: string;
    ward: string;
    wardCode: string;
    district: string;
    districtId: number;
    city: string;
  };
  userProvidedGender?: string;
  userProvidedPhoneNumber?: string;
  userProvidedShoeSize?: string;
  userProvidedEmail?: string;
  userProvidedName?: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  userProvidedProfilePic?: string;
}

export interface IProfileDao {
  createByUserAccount(account: UserAccount): Promise<UserProfile>;
  findById(profileId: string | ObjectId): Promise<UserProfile | undefined>;
  findByAccountId(accountId: string): Promise<UserProfile | undefined>;
  registerDeviceForPushNotification(
    profileId: string,
    installationId: string,
    platform: string,
    pushChannel: string
  ): Promise<UserProfile | undefined>;
  updateById(
    profileId: string,
    update: ProfileUpdateInput
  ): Promise<UserProfile | undefined>;
  findByFirebaseAccountId(uid: string): Promise<UserProfile | undefined>;
  createUserWithFirebaseAccountId({
    firebaseAccountId,
    userProvidedEmail,
  }: {
    firebaseAccountId: string;
    userProvidedEmail?: string;
  }): Promise<UserProfile | undefined>;
}
