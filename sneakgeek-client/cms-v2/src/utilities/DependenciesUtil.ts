import { ObjectFactory, FactoryKeys, ISettingsProvider, SettingsKey } from 'business';

export const getToken = () => {
  const settingsProvider: ISettingsProvider = ObjectFactory.getObjectInstance(
    FactoryKeys.ISettingsProvider,
  );
  return settingsProvider.getValue(SettingsKey.CurrentAccessToken);
};
