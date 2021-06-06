import { ISettingsProvider } from "business";

export class SettingsProvider implements ISettingsProvider {
  isSettingsLoaded(): boolean {
    return true;
  }

  load(): Promise<boolean> {
    return Promise.resolve(true);
  }

  loadServerSettings(): Promise<boolean> {
    return Promise.resolve(true);
  }

  save(): Promise<boolean> {
    return Promise.resolve(true);
  }

  getValue(key: string) {
    return localStorage.getItem(key);
  }

  removeValue(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }

  setValue(key: string, value: any): Promise<void> {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }

  clear(): Promise<void> {
    localStorage.clear();
    return Promise.resolve();
  }
}
