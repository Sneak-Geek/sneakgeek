import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { UserProfile } from "./UserProfile";

export enum AccountProvider {
  email = "email",
  facebook = "facebook",
  google = "google",
  apple = "apple",
}

export enum AccessLevel {
  User = "User",
  Partner = "Partner",
  Authenticator = "Authenticator",
  Content = "Content",
  Manager = "Manager",
  Admin = "Admin",
}

const AccountNameSchema = new mongoose.Schema({
  familyName: String,
  givenName: String,
  middleName: String,
});

export const UserAccountSchema = new mongoose.Schema(
  {
    accountProvider: {
      type: String,
      enum: Object.keys(AccountProvider),
      required: true,
    },
    accountIdByProvider: {
      type: String,
      required: false,
      unique: true,
    },
    accountNameByProvider: AccountNameSchema,
    accountProfilePicByProvider: String,
    accountGenderByProvider: String,
    accountEmailByProvider: {
      type: String,
      required: false,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accessLevel: {
      type: String,
      enum: Object.keys(AccessLevel),
      default: AccessLevel.User,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

UserAccountSchema.methods.toJSON = function (this: UserAccount) {
  const userAccountObject = this.toObject();
  delete userAccountObject.password;

  return userAccountObject;
};

export type UserAccount = Document<{
  accountProvider: string;
  accountIdByProvider?: string;
  accountNameByProvider: {
    familyName: string;
    givenName: string;
    middleName?: string;
  };
  accountGenderByProvider?: string;
  accountEmailByProvider: string;
  accountProfilePicByProvider?: string;
  isVerified: boolean;
  accessLevel: AccessLevel;
  profile: mongoose.Types.ObjectId | UserProfile;
  password: string;
}>;

export const UserAccountRepository: Repository<UserAccount> = mongoose.model<UserAccount>(
  "UserAccount",
  UserAccountSchema
);
