// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { Brand, SizeStandard, ShoeSize, NotificationPlatform } from "../../assets";

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

export const UserProfileSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      unique: true,
    },
    userProvidedProfilePic: String,
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
    isSeller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, strict: true }
);

export type UserProfile = Document<{
  accountId: mongoose.Types.ObjectId;
  userProvidedProfilePic: string;
  userProvidedName: UserName;
  userProvidedAddress: UserAddress;
  userProvidedGender: string;
  userProvidedEmail: string;
  userProvidedPhoneNumber: string;
  isSeller: boolean;
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

export const UserProfileRepository: Repository<UserProfile> = mongoose.model(
  "UserProfile",
  UserProfileSchema
);
