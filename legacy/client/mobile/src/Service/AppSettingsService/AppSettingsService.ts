//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { IAppSettingsService, IAppSettings } from "./IAppSettingsService";
import AsyncStorage from "@react-native-community/async-storage";
import { SettingsKeys } from "./SettingsKeys";
import { injectable } from "inversify";
import ApiClient from "../ApiClient";
import HttpStatus from "http-status";

@injectable()
export class AppSettingsService implements IAppSettingsService {
  private _dict: IAppSettings = {};
  private _isLoaded: boolean = false;

  public async /** override */ load(): Promise<boolean> {
    const value = await AsyncStorage.getItem(SettingsKeys.LocalSettings);

    if (value) {
      try {
        this._dict = Object.assign(this._dict, JSON.parse(value));
      } catch (error) {
        console.log(`Load settings error: ${error}`);
      }
    }

    this._isLoaded = true;
    return true;
  }

  public async /** override */ loadServerSettings(): Promise<boolean> {
    if (!this._isLoaded) {
      throw new Error("App settings is not loaded");
    }

    if (!this._dict[SettingsKeys.CurrentAccessToken]) {
      throw new Error("Current access token is not ready");
    }

    const headers = { authorization: this._dict[SettingsKeys.CurrentAccessToken] };
    const response = await ApiClient.get("/settings", { headers });
    if (response && response.status === HttpStatus.OK) {
      this._dict[SettingsKeys.RemoteSettings] = response.data;
      await this.save();
      return true;
    }

    return false;
  }

  public /** override */ getSettings(): IAppSettings {
    return this._dict;
  }

  public /** override */ isSettingsLoaded(): boolean {
    return this._isLoaded;
  }

  public async /** override */ save(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(SettingsKeys.LocalSettings, JSON.stringify(this._dict));
      return true;
    } catch (error) {
      return false;
    }
  }

  public /** override */ getValue(key: string): any {
    if (!this._isLoaded) {
      throw new Error("Settings are not loaded");
    }
    return this._dict[key];
  }

  public async /** override */ removeValue(key: string): Promise<void> {
    if (!this._isLoaded) {
      throw new Error("Settings are not loaded");
    }

    delete this._dict[key];
    await this.save();
  }

  public async /** override */ setValue(key: string, value: any): Promise<void> {
    this._dict[key] = value;
    await this.save();
  }

  public async /** override */ clear(): Promise<void> {
    this._dict = {};
    await this.save();
  }
}
