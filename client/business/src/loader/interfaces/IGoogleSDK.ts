//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

export type StatusCodes = {
  signInCanceled: string;
  inProgress: string;
  playServiceNotAvailable: string;
};

export interface SignInResult {
  idToken?: string;
  serverAuthCode?: string;
  scopes?: Array<string>;
  user?: {
    email: string;
    id: string;
    givenName: string;
    familyName: string;
    photo: string;
    name: string;
  };
  error?: any;
}

export interface IGoogleSDK {
  signIn(): Promise<SignInResult>;
}
