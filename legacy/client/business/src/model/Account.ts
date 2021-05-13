import { Profile } from "./Profile";

export type AuthProvider = "facebook" | "google" | "apple";

export type Account = {
  isVerified: boolean;
  accessLevel: string;
  _id: string;
  profile: string | Partial<Profile>;
  createdAt: string;
  updatedAt: string;
  accountProvider: AuthProvider;
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
};
