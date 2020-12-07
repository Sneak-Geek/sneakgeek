import { createAction } from "redux-actions";
import { AuthenticationPayload } from "../Shared/Payload";
import { NetworkRequestState } from "../Shared/State";
import { container, Types } from "../Config/Inversify";
import { IAccountService } from "../Service/AuthenticationService";
import { IAppSettingsService, SettingsKeys } from "../Service/AppSettingsService";
import { getUserProfile } from "./AccountActions";

export const AuthenticationActions = {
  UPDATE_THIRD_PARTY_AUTH_STATE: "UPDATE_THIRTH_PARTY_AUTH_STATE",
  UPDATE_SNKG_AUTHENTICATION_STATE: "UPDATE_AUTHENTICATION_STATE"
};

export const updateSnkgAuthState = createAction<AuthenticationPayload>(
  AuthenticationActions.UPDATE_SNKG_AUTHENTICATION_STATE
);

export const authenticateWithEmail = (email: string, password: string) => {
  return async (dispatch: Function) => {
    dispatch(updateSnkgAuthState({ state: NetworkRequestState.REQUESTING }));
    try {
      const accountService = container.get<IAccountService>(Types.IAccountService);
      const settings = container.get<IAppSettingsService>(Types.IAppSettingsService);

      const accountPayload = await accountService.loginEmail(email, password);
      if (accountPayload) {
        await settings.setValue(SettingsKeys.CurrentAccessToken, accountPayload.token);
        await settings.loadServerSettings();

        await dispatch(getUserProfile(accountPayload.token));
        dispatch(updateSnkgAuthState({ state: NetworkRequestState.SUCCESS, account: accountPayload.user }));
      }
    } catch (error) {
      dispatch(updateSnkgAuthState({ state: NetworkRequestState.FAILED, error }));
    }
  };
};
