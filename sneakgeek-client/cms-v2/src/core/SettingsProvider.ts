import { ISettingsProvider } from 'business';

export class SettingsProvider implements ISettingsProvider {
  public isSettingsLoaded(): boolean {
    return true;
  }

  public load(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public loadServerSettings(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public save(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public getValue(key: string): string | null {
    return localStorage.getItem(key);
  }

  public removeValue(key: string): Promise<void> {
    localStorage.removeItem(key);
    return Promise.resolve();
  }

  public setValue(key: string, value: string): Promise<void> {
    localStorage.setItem(key, value);
    return Promise.resolve();
  }

  public clear(): Promise<void> {
    localStorage.clear();
    return Promise.resolve();
  }
}
