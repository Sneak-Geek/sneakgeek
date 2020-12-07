import React, {useState, useEffect} from 'react';
import RootStack from 'navigations/RootStack';
import {
  ObjectFactory as Factory,
  FactoryKeys as Keys,
  IFacebookSDK,
  IGoogleSDK,
  IEnvVar,
  ISettingsProvider,
  IAccountService,
  AccountService,
  ICatalogService,
  CatalogService,
  IShoeService,
  ShoeService,
  ISettingService,
  SettingService,
  IOrderService,
  OrderService,
  ICdnService,
  CdnService,
  IAppleAuthSdk,
} from 'business';
import {Provider} from 'react-redux';

import {SettingsProvider, FacebookSdk, KeyExtensions, GoogleSdk} from 'common';

import {AppStore} from 'store/AppStore';
import {InAppNotification} from 'screens/InAppNotification';
import {AppLoadingIndicator} from 'screens/AppLoadingIndicator';
import {IDeviceInfoProvider, DeviceInfoProvider} from 'providers';
import {IPushNotificationService, PushNotificationService} from 'services';
import {AppleAuthSdk} from 'common/AppleAuthSdk';

export default function App(): JSX.Element {
  const [depLoaded, setDepLoaded] = useState(false);

  const initializeBusinessDep = async (): Promise<void> => {
    const settingsProvider = new SettingsProvider();
    await settingsProvider.load();
    settingsProvider.loadServerSettings();

    Factory.register<ISettingsProvider>(
      Keys.ISettingsProvider,
      settingsProvider,
    );
    Factory.register<IEnvVar>(Keys.IEnvVar, {
      dev: __DEV__,
      devUrl: 'http://10.0.0.93:8080/api/v1',
      prodUrl: 'https://sneakgeek-dev.azurewebsites.net/api/v1',
    });
    Factory.register<IFacebookSDK>(Keys.IFacebookSDK, new FacebookSdk());
    Factory.register<IGoogleSDK>(Keys.IGoogleSDK, new GoogleSdk());
    Factory.register<IAppleAuthSdk>(Keys.IAppleAuthSdk, new AppleAuthSdk());
    Factory.register<IAccountService>(
      Keys.IAccountService,
      new AccountService(),
    );
    Factory.register<ICatalogService>(
      Keys.ICatalogService,
      new CatalogService(),
    );
    Factory.register<IShoeService>(Keys.IShoeService, new ShoeService());
    Factory.register<ISettingService>(
      Keys.ISettingService,
      new SettingService(),
    );
    Factory.register<IOrderService>(Keys.IOrderService, new OrderService());
    Factory.register<ICdnService>(Keys.ICdnService, new CdnService());
    Factory.register<IDeviceInfoProvider>(
      KeyExtensions.IDeviceInfoProvider,
      new DeviceInfoProvider(),
    );
    Factory.register<IPushNotificationService>(
      KeyExtensions.IPushNotificationService,
      new PushNotificationService(),
    );
  };

  useEffect(() => {
    Promise.all([initializeBusinessDep()]).then(() => {
      setDepLoaded(true);
    });
  });

  return (
    <Provider store={AppStore}>
      {depLoaded ? (
        <>
          <InAppNotification />
          <AppLoadingIndicator />
          <RootStack />
        </>
      ) : (
        <></>
      )}
    </Provider>
  );
}
