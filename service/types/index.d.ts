//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export interface GooglePassportStrategyProfile {
  name: {
    familyName: string;
    givenName: string;
  };
  displayName: string;
  id: string;
  emails: [{ value: string }];
  provider: "google";
}

export interface JwtPayload {
  accountId?: string;
  [key: string]: any;
}
