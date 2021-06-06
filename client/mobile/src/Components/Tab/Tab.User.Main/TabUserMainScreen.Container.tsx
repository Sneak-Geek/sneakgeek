// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import TabUserMainScreen from "./TabUserMainScreen";
import { IAppState } from "../../../Store";
import { NavigationActions } from "react-navigation";
import { RouteNames } from "../../../Navigation";
import { navigateToLoginByLogout, reset, updateUserProfile } from "../../../Actions";
import { container, Types } from "../../../Config/Inversify";
import { IAppSettingsService } from "../../../Service/AppSettingsService";
import { ImagePickerResponse } from "react-native-image-picker";

const mapStateToProps = (state: IAppState) => ({
  account: state.AccountState.currentAccount,
  profile: state.AccountState.userProfileState.profile,
  updateUserProfileState: state.AccountState.userProfileState.state
});

const mapDispatchToProps = (dispatch: Function) => {
  return {
    navigateToUserEdit: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.Tabs.UserInfoTab.Edit
        })
      );
    },

    navigateToPayments: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.PaymentOptions
        })
      );
    },

    navigateToShoeSize: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.ShowSize
        })
      );
    },

    navigateToChangePassword: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.ChangePassword
        })
      );
    },

    navigateToContactInfo: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.ContactInfo
        })
      );
    },

    navigateToSearch: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.Tabs.UserInfoTab.Search
        })
      );
    },

    navigateToUserKind: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.UserKind
        })
      );
    },

    navigateToNotiSetting: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.NotiSetting
        })
      );
    },

    navigateToShare: () => {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.Share
        })
      );
    },

    updateProfilePic: (imageUri: ImagePickerResponse) => {
      dispatch(updateUserProfile({ newProfilePic: imageUri.uri, profilePicType: imageUri.type }));
    },

    logout: () => {
      const appSettingsService = container.get<IAppSettingsService>(Types.IAppSettingsService);
      appSettingsService.clear();

      dispatch(reset());
      dispatch(navigateToLoginByLogout());
    }
  };
};

export const TabUserMainScreenContainer = connect(mapStateToProps, mapDispatchToProps)(TabUserMainScreen);
