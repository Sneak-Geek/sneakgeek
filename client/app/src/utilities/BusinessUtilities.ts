import {
  ObjectFactory,
  ISettingsProvider,
  FactoryKeys,
  SettingsKey,
} from 'business';

export function getToken() {
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider,
  );
  return settings.getValue(SettingsKey.CurrentAccessToken);
}

export function getDependency<T>(key: symbol): T {
  return ObjectFactory.getObjectInstance<T>(key);
}
