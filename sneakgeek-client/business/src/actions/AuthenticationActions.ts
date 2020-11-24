import { createAction } from "redux-actions";
import { AuthenticationPayload, NetworkRequestState } from "../payload";
import { ObjectFactory, FactoryKeys } from "../loader/kernel";
import { IAccountService, ISettingsProvider, IFacebookSDK } from "../loader";
import { SettingsKey, IGoogleSDK, IAppleAuthSdk } from "../loader/interfaces";
import { getUserProfile } from "./ProfileActions";
import { Dispatch } from "redux";

export const AuthenticationActions = {
  UPDATE_AUTHENTICATION_STATE: "UPDATE_AUTHENTICATION_STATE",
};

export const updateAuthenticationState = createAction<AuthenticationPayload>(
  AuthenticationActions.UPDATE_AUTHENTICATION_STATE
);

export const getCurrentUser = () => {
  const accountService = ObjectFactory.getObjectInstance<IAccountService>(
    FactoryKeys.IAccountService
  );
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider
  );

  return async (dispatch: Dispatch<any>) => {
    dispatch(
      updateAuthenticationState({ state: NetworkRequestState.REQUESTING })
    );
    const token = settings.getValue(SettingsKey.CurrentAccessToken);

    try {
      const accountPayload = await accountService.getCurrentUser(token);
      if (accountPayload) {
        await settings.loadServerSettings();
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.SUCCESS,
            data: accountPayload,
          })
        );
        dispatch(getUserProfile());
      } else {
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.FAILED,
            error: new Error("Empty account"),
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const authenticateWithEmail = (
  email: string,
  password: string,
  isSignUp: boolean = false
) => {
  const accountService = ObjectFactory.getObjectInstance<IAccountService>(
    FactoryKeys.IAccountService
  );
  const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
    FactoryKeys.ISettingsProvider
  );

  return async (dispatch: Function) => {
    dispatch(
      updateAuthenticationState({ state: NetworkRequestState.REQUESTING })
    );
    try {
      const accountPayload = await accountService.emailAuth(
        email,
        password,
        isSignUp
      );
      if (accountPayload) {
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          accountPayload.token
        );
        await settings.loadServerSettings();

        await dispatch(getUserProfile());
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.SUCCESS,
            data: accountPayload,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const authenticateWithFb = () => {
  return async (dispatch: Function) => {
    const permissions = ["public_profile", "email"];
    const fbSdk = ObjectFactory.getObjectInstance<IFacebookSDK>(
      FactoryKeys.IFacebookSDK
    );
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    try {
      const loginResult = await fbSdk.loginWithPermission(permissions);

      if (loginResult.isCancelled) {
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.FAILED,
          })
        );
      } else {
        const accessToken = await fbSdk.getCurrentAccessToken();
        const accountPayload = await accountService.login(
          accessToken,
          "facebook"
        );
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          accountPayload!.token
        );
        dispatch(getUserProfile());
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.SUCCESS,
            data: accountPayload,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const authenticateWithGoogle = () => {
  return async (dispatch: Function) => {
    const ggSdk = ObjectFactory.getObjectInstance<IGoogleSDK>(
      FactoryKeys.IGoogleSDK
    );
    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );
    try {
      const signInResult = await ggSdk.signIn();
      if (signInResult && signInResult.idToken) {
        const accessToken = signInResult.idToken;
        const accountPayload = await accountService.login(
          accessToken as string,
          "google"
        );
        await settings.setValue(
          SettingsKey.CurrentAccessToken,
          accountPayload?.token
        );
        dispatch(getUserProfile());
        dispatch(
          updateAuthenticationState({
            state: NetworkRequestState.SUCCESS,
            data: accountPayload,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};

export const authenticateWithApple = () => {
  return async (dispatch: Dispatch<any>) => {
    const appleSdk = ObjectFactory.getObjectInstance<IAppleAuthSdk>(
      FactoryKeys.IAppleAuthSdk
    );

    const accountService = ObjectFactory.getObjectInstance<IAccountService>(
      FactoryKeys.IAccountService
    );
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );

    try {
      const userToken = await appleSdk.signIn();
      const accountPayload = await accountService.login(userToken, "apple");
      await settings.setValue(
        SettingsKey.CurrentAccessToken,
        accountPayload?.token
      );
      dispatch(getUserProfile());
      dispatch(
        updateAuthenticationState({
          state: NetworkRequestState.SUCCESS,
          data: accountPayload,
        })
      );
    } catch (error) {
      dispatch(
        updateAuthenticationState({ state: NetworkRequestState.FAILED, error })
      );
    }
  };
};
