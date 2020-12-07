//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export type AuthProvider = "facebook" | "google";

export enum ApiRequestState {
  NOT_STARTED,
  REQUESTING,
  SUCCESS,
  CANCELED,
  FAILED
}

// App Model
export interface Profile {
  _id: string;
  accountId: string;
  favoriteShoes: string[];
  ownedShoes: Array<{
    shoeId: string;
    owned: Array<{ number: number; shoeSize: string }>;
  }>;
  userProvidedName?: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  userProvidedAddress?: string;
  userProvidedGender?: string;
  userProvidedShoeSize?: string;
  userProvidedEmail?: string;
  userProvidedPhoneNumber?: string;
}

export interface Account {
  isVerified: boolean;
  accessLevel: number;
  _id: string;
  profileId: string;
  createdAt: string;
  updatedAt: string;
  accountProvider: "facebook" | "google";
  accountIdByProvider: string;
  accountNameByProvider: {
    familyName: string;
    givenName: string;
    middleName: string;
  };
  accountGenderByProvider: string;
  accountEmailByProvider: string;
  accountProfilePicByProvider: string;
  isAuthenticating: boolean;
  authenticationError: any;
  isAuthenticatingWithFacebook: boolean;
  isAuthenticationCancelled: boolean;
}

export type ApiRequestPayload<T> = {
  state: ApiRequestState;
  error?: any;
  data: T;
};

// Authentication and account
export type AuthType = "ThirdParty" | "OnPrem";
export type AuthPayload = {
  authType: AuthType;
  account?: Account;
};
