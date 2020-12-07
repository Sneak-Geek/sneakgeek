import {
  ISettingsProvider,
  SettingsKey,
  ObjectFactory,
  FactoryKeys,
  ISettingService,
} from 'business';
import AsyncStorage from '@react-native-community/async-storage';

export class SettingsProvider implements ISettingsProvider {
  private _isLoaded = false;
  private _storageKey: string = SettingsKey.LocalSettings;
  private _values: {[key: string]: string} = {};

  public isSettingsLoaded(): boolean {
    return this._isLoaded;
  }

  public async load(): Promise<boolean> {
    const value = await AsyncStorage.getItem(this._storageKey);
    this._values = {...this._values, ...JSON.parse(value)};

    this._isLoaded = true;
    return true;
  }

  public async loadServerSettings(): Promise<boolean> {
    const settingsService = ObjectFactory.getObjectInstance<ISettingService>(
      FactoryKeys.ISettingService,
    );

    try {
      const remoteSettings = await settingsService.getServerSettings();
      await this.setValue(SettingsKey.RemoteSettings, remoteSettings);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async save(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        this._storageKey,
        JSON.stringify(this._values),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  public getValue(key: string) {
    if (!this._isLoaded) {
      throw new Error('Settings are not loaded');
    }

    return this._values[key];
  }

  public async removeValue(key: string): Promise<void> {
    if (!this._isLoaded) {
      throw new Error('Settings are not loaded');
    }

    delete this._values[key];
    await this.save();
  }

  public async setValue(key: string, value: any): Promise<void> {
    this._values[key] = value;
    await this.save();
  }

  public async clear(): Promise<void> {
    this._values = {};
    await this.save();
  }
}
