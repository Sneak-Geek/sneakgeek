// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { Brand, SizeStandard, ShoeSize, NotificationPlatform } from "../../assets";
import { ObjectId } from "mongodb";

const UserProvidedNameSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
});

const UserProvidedAddressSchema = new mongoose.Schema({
  streetAddress: String,
  ward: String,
  wardCode: String,
  district: String,
  districtId: Number,
  city: String,
});

const NotificationSettingSchema = new mongoose.Schema({
  tags: {
    type: [String],
    required: true,
  },
  registeredDevices: {
    type: [
      {
        installationId: {
          type: String,
          required: true,
        },
        platform: {
          type: String,
          enum: NotificationPlatform,
          required: true,
        },
        pushChannel: {
          type: String,
          required: true,
        },
      },
    ],
  },
});

export const UserProfileSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      unique: true,
    },
    userProvidedProfilePic: String,
    favoriteShoeBrand: {
      type: String,
      enum: Object.keys(Brand),
    },
    shoeSizeStandard: {
      type: String,
      default: SizeStandard.US,
      enum: Object.keys(SizeStandard),
    },
    userProvidedName: UserProvidedNameSchema,
    userProvidedAddress: UserProvidedAddressSchema,
    userProvidedGender: String,
    userProvidedEmail: {
      type: String,
      unique: true,
    },
    userProvidedPhoneNumber: {
      type: String,
    },
    userProvidedShoeSize: {
      type: String,
      enum: ShoeSize.Adult,
    },
    notificationSetting: {
      type: NotificationSettingSchema,
      default: {
        tags: [],
        registeredDevices: [],
      },
    },
  },
  { timestamps: true, strict: true }
);

export type UserProfile = Document<{
  accountId: mongoose.Types.ObjectId;
  userProvidedProfilePic: string;
  favoriteShoeBrand: string;
  shoeSizeStandard: string;
  userProvidedName: UserName;
  userProvidedAddress: UserAddress;
  userProvidedGender: string;
  userProvidedEmail: string;
  userProvidedPhoneNumber: string;
  userProvidedShoeSize: string;
  notificationSetting: NotificationSetting;
  notifications: Array<Notification>;
}>;

type UserAddress = Document<{
  streetAddress: string;
  ward: string;
  wardCode: string;
  district: string;
  districtId: number;
  city: string;
}>;

type UserName = Document<{
  firstName: string;
  middleName: string;
  lastName: string;
}>;

type NotificationSetting = Document<{
  tags: [string];
  registeredDevices: Array<{
    installationId: string;
    platform: string;
    pushChannel: string;
  }>;
}>;

export const UserProfileRepository: Repository<UserProfile> = mongoose.model(
  "UserProfile",
  UserProfileSchema
);
