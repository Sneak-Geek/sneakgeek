// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { container, Types } from "../Config/Inversify";
import { IAppSettingsService } from "../Service/AppSettingsService";
import { SettingsKeys } from "../Service/AppSettingsService/SettingsKeys";
import { getCurrentUser, navigateToLogin } from ".";
import SplashScreen from "react-native-splash-screen";

export const bootstrap = () => {
  return async (dispatch: Function) => {
    // Load settings
    const settingsProvider = container.get<IAppSettingsService>(Types.IAppSettingsService);
    await settingsProvider.load();

    // Hide splash
    SplashScreen.hide();

    const accessToken = settingsProvider.getValue(SettingsKeys.CurrentAccessToken);
    if (accessToken) {
      await dispatch(getCurrentUser(accessToken));
      await settingsProvider.loadServerSettings();
    } else {
      dispatch(navigateToLogin());
    }
  };
};
