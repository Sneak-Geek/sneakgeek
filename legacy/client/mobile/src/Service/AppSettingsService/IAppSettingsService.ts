//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { SettingsKeys } from "./SettingsKeys";

export interface IAppSettingsService {
  isSettingsLoaded(): boolean;
  /** Load the settings. Returns a promise indicating when the load operation is complete, and if it was successful. */
  load(): Promise<boolean>;

  /** Load server settings */
  loadServerSettings(): Promise<boolean>;

  /** Save the settings. Returns a promise indicating when the save operation is complete, and if it was successful. */
  save(): Promise<boolean>;

  /** Get a setting by the key. */
  getValue(key: string): any;

  /** Remove a setting by the key. */
  removeValue(key: string): Promise<void>;

  /** Set a setting value. */
  setValue(key: string, value: any): Promise<void>;

  /** Clears all the data in the settings provider */
  clear(): Promise<void>;

  /** Get all settings */
  getSettings(): IAppSettings;
}

export interface IAppSettings {
  [SettingsKeys.CurrentAccessToken]?: string;
  [SettingsKeys.LocalSettings]?: string;
  [SettingsKeys.RemoteSettings]?: {
    shoeConditions: string[];
    boxConditions: string[];
    shoeSizes: {
      Adult: string[];
      Kid: {
        GradeSchool: string[];
        PreSchool: string[];
        Toddler: string[];
      };
    };
    shoeBrands: string[];
    genders: string[];
    sellDuration: { duration: number; unit: string; stringRep: string }[];
    faq: [
      {
        category: string;
        info: [
          {
            answer: string;
            question: string;
          }
        ];
      }
    ];
  };
  [key: string]: any;
}
