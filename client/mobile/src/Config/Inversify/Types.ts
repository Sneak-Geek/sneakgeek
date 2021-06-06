//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export const Types = {
  IStoreProvider: Symbol.for("IStoreProvider"),
  IAppSettingsService: Symbol.for("IAppSettingsService"),
  IAccountService: Symbol.for("IAuthenticationService"),

  ApiClient: Symbol.for("ApiClient"),
  IAppContentService: Symbol.for("IAppContentService"),
  ICdnService: Symbol.for("ICdnService"),
  ITransactionService: Symbol.for("ITransactionService")
};
