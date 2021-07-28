import React, { useState, useEffect } from 'react';
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
  IInventoryService,
  InventoryService,
} from 'business';
import { Provider } from 'react-redux';
import { SettingsProvider, FacebookSdk, KeyExtensions, GoogleSdk } from 'common';
import { AppStore } from 'store/AppStore';
import { InAppNotification } from 'screens/InAppNotification';
import { AppLoadingIndicator } from 'screens/AppLoadingIndicator';
import { IDeviceInfoProvider, DeviceInfoProvider } from 'providers';
import { AppleAuthSdk } from 'common/AppleAuthSdk';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from 'ErrorBoundary';
import { Platform, StatusBar } from 'react-native';
import { themes } from 'resources';
import Config from 'react-native-config';

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
      apiEndpoint: Config.API_ENDPOINT,
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
    Factory.register<IInventoryService>(
      KeyExtensions.IInventoryService,
      new InventoryService(),
    );
  };

  useEffect(() => {
    Promise.all([initializeBusinessDep()]).then(() => {
      setDepLoaded(true);
    });
  });

  return (
    <SafeAreaProvider>
      <Provider store={AppStore}>
        {Platform.OS === 'android' && (
          <StatusBar
            backgroundColor={themes.AppAccentColor}
            barStyle={'light-content'}
          />
        )}
        {depLoaded ? (
          <>
            <RootStack />
            <InAppNotification />
            <AppLoadingIndicator />
          </>
        ) : (
          <></>
        )}
      </Provider>
    </SafeAreaProvider>
  );
}
