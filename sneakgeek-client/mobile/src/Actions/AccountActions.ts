// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { createAction } from "redux-actions";
import { invariant } from "ts-invariant";
import { Account, Profile } from "../Shared/Model";
import { AccessToken, LoginManager, LoginResult } from "react-native-fbsdk";
import { GoogleSignin, User as GoogleUser } from "react-native-google-signin";
import AppConfig from "../Config/ThirdParty";
import { container, Types } from "../Config/Inversify";
import { IAccountService } from "../Service/AuthenticationService";
import { IAppSettingsService, SettingsKeys } from "../Service/AppSettingsService";
import { showNotification } from "./NotificationActions";
import {
  ChangePasswordPayload,
  CheckAccountWithEmailPayload,
  GetUserProfilePayload,
  RequestTokenPayload,
  SetPasswordPayload,
  UpdateUserProfilePayload,
  VerifyTokenPayload
} from "../Shared/Payload";
import { NetworkRequestState } from "../Shared/State";
import {
  navigateToEmailSignIn,
  navigateToEmailSignUp,
  navigateToLogin,
  navigateToPreviousScreen
} from "./NavigationActions";
import { ICdnService } from "../Service";

// tslint:disable-next-line: no-namespace
export namespace AccountActions {
  export const AUTHENTICATE_ERROR = "AUTHENTICATION_ERROR";
  export const AUTHENTICATE_ON_PREM = "AUTHENTICATE_ON_PREM";
  export const AUTHENTICATION_COMPLETE = "AUTHENTICATION_COMPLETE";
  export const THIRD_PARTY_CANCELED_AUTH = "THIRD_PARTY_CANCELED_AUTH";
  export const GO_TO_LOGIN = "GO_TO_LOGIN";
  export const UPDATE_STATE_GET_USER_PROFILE = "UPDATE_GET_USER_PROFILE";
  export const UPDATE_STATE_UPDATE_USER_PROFILE = "UPDATE_UPDATE_USER_PROFILE";
  export const UPDATE_STATE_CHECK_ACCOUNT_WITH_EMAIL = "UPDATE_STATE_CHECK_ACCOUNT_WITH_EMAIL";
  export const UPDATE_STATE_REQUEST_TOKEN = "UPDATE_STATE_REQUEST_TOKEN";
  export const UPDATE_STATE_VERIFY_TOKEN = "UPDATE_STATE_VERIFY_TOKEN";
  export const UPDATE_STATE_SET_PASSWORD = "UPDATE_STATE_SET_PASSWORD";
  export const UPDATE_STATE_CHANGE_PASSWORD = "UPDATE_STATE_CHANGE_PASSWORD";
  export const UPDATE_STATE_UPLOAD_PROFILE_PIC = "UPDATE_STATE_UPLOAD_PROFILE_PIC";
}

export const cancelThirdPartyAuthentication = createAction<"facebook" | "google">(
  AccountActions.THIRD_PARTY_CANCELED_AUTH
);
export const authenticationError = createAction(AccountActions.AUTHENTICATE_ERROR);
export const onPremAuthenticate = createAction(AccountActions.AUTHENTICATE_ON_PREM);
export const authenticationComplete = createAction<Account>(AccountActions.AUTHENTICATION_COMPLETE);
export const updateStateGetUserProfile = createAction<GetUserProfilePayload>(
  AccountActions.UPDATE_STATE_GET_USER_PROFILE
);
export const updateStateUpdateUserProfile = createAction<
  UpdateUserProfilePayload & { newProfilePic?: string; profilePicType?: string }
>(AccountActions.UPDATE_STATE_UPDATE_USER_PROFILE);
export const updateStateCheckAccountWithEmail = createAction<CheckAccountWithEmailPayload>(
  AccountActions.UPDATE_STATE_CHECK_ACCOUNT_WITH_EMAIL
);
export const updateStateRequestToken = createAction<RequestTokenPayload>(AccountActions.UPDATE_STATE_REQUEST_TOKEN);
export const updateStateVerifyToken = createAction<VerifyTokenPayload>(AccountActions.UPDATE_STATE_VERIFY_TOKEN);
export const updateStateSetPassword = createAction<SetPasswordPayload>(AccountActions.UPDATE_STATE_SET_PASSWORD);
export const updateStateChangePassword = createAction<ChangePasswordPayload>(
  AccountActions.UPDATE_STATE_CHANGE_PASSWORD
);

export const changePassword = (currentPassword: string, newPassword: string) => {
  return async (dispatch: Function) => {
    const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const token = appSettings.getValue(SettingsKeys.CurrentAccessToken);

    try {
      dispatch(
        updateStateChangePassword({
          state: NetworkRequestState.REQUESTING,
          error: null
        })
      );
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const response = await accountService.changePassword(token, currentPassword, newPassword);
      if (response) {
        dispatch(
          updateStateChangePassword({
            state: NetworkRequestState.SUCCESS
          })
        );
        dispatch(navigateToPreviousScreen());
      }
    } catch (error) {
      dispatch(
        updateStateChangePassword({
          state: NetworkRequestState.FAILED,
          error
        })
      );
    }
  };
};
export const checkAccountWithEmail = (email: string) => {
  return async (dispatch: Function) => {
    try {
      dispatch(
        updateStateCheckAccountWithEmail({
          state: NetworkRequestState.REQUESTING,
          error: null
        })
      );
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const response = await accountService.isAccountWithEmailExists(email);
      const accountExists = response.existStatus;
      dispatch(
        updateStateCheckAccountWithEmail({
          state: NetworkRequestState.SUCCESS,
          existStatus: accountExists,
          error: null
        })
      );
      if (accountExists) {
        dispatch(navigateToEmailSignIn(email));
      } else {
        dispatch(navigateToEmailSignUp(email));
      }
    } catch (error) {
      dispatch(updateStateCheckAccountWithEmail({ error, state: NetworkRequestState.FAILED }));
    }
  };
};

export const setNewPassword = (email: string, token: string, newPassword: string) => {
  return async (dispatch: Function) => {
    dispatch(
      updateStateSetPassword({
        state: NetworkRequestState.REQUESTING
      })
    );
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const response = await accountService.setNewPassword(email, token, newPassword);

      dispatch(updateStateSetPassword({ state: NetworkRequestState.SUCCESS }));
      if (response && response.user) {
        dispatch(authenticationComplete(response.user));
      }
    } catch (error) {
      dispatch(updateStateSetPassword({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const verifyToken = (email: string, token: string) => {
  return async (dispatch: Function) => {
    dispatch(
      updateStateVerifyToken({
        state: NetworkRequestState.REQUESTING,
        error: null
      })
    );
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      await accountService.verifyConfirmationToken(email, token);
      dispatch(
        updateStateVerifyToken({
          state: NetworkRequestState.SUCCESS
        })
      );
    } catch (error) {
      dispatch(
        updateStateVerifyToken({
          state: NetworkRequestState.FAILED,
          error
        })
      );
    }
  };
};

export const requestTokenConfirm = (email: string) => {
  return async (dispatch: Function) => {
    dispatch(
      updateStateRequestToken({
        state: NetworkRequestState.REQUESTING,
        error: null
      })
    );
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      await accountService.requestConfirmationToken(email);

      dispatch(
        updateStateRequestToken({
          state: NetworkRequestState.SUCCESS,
          error: null
        })
      );
    } catch (error) {
      dispatch(
        updateStateRequestToken({
          error,
          state: NetworkRequestState.FAILED
        })
      );
    }
  };
};

export const emailSignup = (email: string, password: string) => {
  return async (dispatch: Function) => {
    dispatch(onPremAuthenticate());
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const settings = container.get<IAppSettingsService>(Types.IAppSettingsService);

      const accountPayload = await accountService.signupEmail(email, password);
      if (accountPayload) {
        await settings.setValue(SettingsKeys.CurrentAccessToken, accountPayload.token);
        await settings.loadServerSettings();

        await dispatch(getUserProfile(accountPayload.token));
        dispatch(showNotification("Đăng ký thành công"));
        dispatch(authenticationComplete(accountPayload.user));
      }
    } catch (error) {
      dispatch(authenticationError(error));
    }
  };
};

export const emailLogin = (email: string, password: string) => {
  return async (dispatch: Function) => {
    dispatch(onPremAuthenticate());
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const settings = container.get<IAppSettingsService>(Types.IAppSettingsService);

      const accountPayload = await accountService.loginEmail(email, password);
      if (accountPayload) {
        await settings.setValue(SettingsKeys.CurrentAccessToken, accountPayload.token);
        await settings.loadServerSettings();

        await dispatch(getUserProfile(accountPayload.token));
        dispatch(authenticationComplete(accountPayload.user));
      }
    } catch (error) {
      dispatch(authenticationError(error));
    }
  };
};

export const notifyError = () => {
  return (dispatch: Function) => {
    dispatch(showNotification("Xảy ra lỗi!"));
  };
};

export const authenticateVsnkrsService = (accessToken: string, provider: "facebook" | "google") => {
  return async (dispatch: Function) => {
    dispatch(onPremAuthenticate());
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const settings = container.get<IAppSettingsService>(Types.IAppSettingsService);

      const accountPayload = await accountService.login(accessToken, provider);
      if (accountPayload) {
        await settings.setValue(SettingsKeys.CurrentAccessToken, accountPayload.token);
        await settings.loadServerSettings();

        await dispatch(getUserProfile(accountPayload.token));
        dispatch(authenticationComplete(accountPayload.user));
      }
    } catch (error) {
      dispatch(authenticationError(error));
    }
  };
};

export const authenticate = (provider: "facebook" | "google") => {
  return async (dispatch: Function) => {
    if (provider === "facebook") {
      dispatch(facebookAuthenticate());
    } else {
      dispatch(googleAuthenticate());
    }
  };
};

export const facebookAuthenticate = () => {
  return async (dispatch: Function) => {
    try {
      const permissions = ["public_profile", "email"];
      const result: LoginResult = await LoginManager.logInWithPermissions(permissions);

      if (result.isCancelled) {
        dispatch(cancelThirdPartyAuthentication("facebook"));
      } else {
        const data = (await AccessToken.getCurrentAccessToken()) as AccessToken;
        invariant(data !== null);
        dispatch(authenticateVsnkrsService(data.accessToken.toString(), "facebook"));
      }
    } catch (error) {
      dispatch(authenticationError(error));
    }
  };
};

export const googleAuthenticate = () => {
  return async (dispatch: Function) => {
    try {
      await GoogleSignin.configure({
        webClientId: AppConfig.GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
        forceConsentPrompt: true
      });
      await GoogleSignin.hasPlayServices();
      const userInfo: GoogleUser = await GoogleSignin.signIn();
      if (userInfo && userInfo.idToken) {
        dispatch(authenticateVsnkrsService(userInfo.idToken, "google"));
      }
    } catch (error) {
      dispatch(authenticationError(error));
    }
  };
};

export const getCurrentUser = (accessToken: string) => {
  return async (dispatch: Function) => {
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const accountPayload = await accountService.getCurrentUser(accessToken);

      dispatch(getUserProfile(accessToken));

      if (accountPayload) {
        dispatch(authenticationComplete(accountPayload.user));
      }
    } catch (error) {
      dispatch(authenticationError(error));
      dispatch(navigateToLogin());
    }
  };
};

export const getUserProfile = (accessToken: string) => {
  return async (dispatch: Function) => {
    dispatch(updateStateGetUserProfile({ state: NetworkRequestState.REQUESTING }));
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const userProfile = await accountService.getUserProfile(accessToken);
      if (userProfile) {
        dispatch(
          updateStateGetUserProfile({
            state: NetworkRequestState.SUCCESS,
            profile: userProfile
          })
        );
      }
    } catch (error) {
      dispatch(updateStateGetUserProfile({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const updateUserProfile = (data: Partial<Profile & { newProfilePic?: string; profilePicType?: string }>) => {
  return async (dispatch: Function) => {
    dispatch(updateStateUpdateUserProfile({ state: NetworkRequestState.REQUESTING }));

    const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
    const accountService = container.get<IAccountService>(Types.IAccountService);
    const cdnService = container.get<ICdnService>(Types.ICdnService);
    const accessToken = appSettings.getSettings().CurrentAccessToken as string;
    const providedPic = data.newProfilePic;

    try {
      if (providedPic) {
        const fileType = data.profilePicType || "";
        const urls = await cdnService.getImageUploadUrls(accessToken, 1);
        await cdnService.uploadImage(providedPic, urls[0], fileType);
        data.userProvidedProfilePic = urls[0];
      }

      // avoid polutting mongo server
      delete data.newProfilePic;
      delete data.profilePicType;

      const result: boolean = await accountService.updateUserProfile(accessToken, data);

      if (result) {
        await dispatch(getUserProfile(accessToken));
        dispatch(showNotification("Cập nhật hồ sơ cá nhân thành công"));
        dispatch(updateStateUpdateUserProfile({ state: NetworkRequestState.SUCCESS }));
      }
    } catch (error) {
      dispatch(updateStateUpdateUserProfile({ state: NetworkRequestState.FAILED, error }));
    }
  };
};

export const addOwnedShoe = (shoeId: string, owned: Array<{ shoeSize: string; number: number }>) => {
  return async (dispatch: Function) => {
    try {
      const appSettings = container.get<IAppSettingsService>(Types.IAppSettingsService);
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const accessToken = appSettings.getSettings().CurrentAccessToken;

      if (accessToken) {
        const success: boolean = await accountService.addOnwedShoes(accessToken, shoeId, owned);

        if (success) {
          dispatch(showNotification("Đã thêm thành công"));
          dispatch(getUserProfile(accessToken));
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
};
