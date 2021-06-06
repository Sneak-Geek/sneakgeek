//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export const FactoryKeys = {
  IEnvVar: Symbol.for("IEnvVar"),
  IAccountService: Symbol.for("IAccountService"),
  IFacebookSDK: Symbol.for("IFacebookSDK"),
  IGoogleSDK: Symbol.for("IGoogleSDK"),
  IAppleAuthSdk: Symbol.for("IAppleAuthSdk"),
  ISettingsProvider: Symbol.for("ISettingsProvider"),
  ICatalogService: Symbol.for("ICatalogService"),
  IShoeService: Symbol.for("IShoeService"),
  ISettingService: Symbol.for("ISettingService"),
  IOrderService: Symbol.for("IOrderService"),
  ICdnService: Symbol.for("ICdnService"),
  INotificationService: Symbol.for("INotificationService"),
  IInventoryService: Symbol.for("IInventoryService")
};