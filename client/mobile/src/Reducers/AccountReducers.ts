// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action } from "redux-actions";
import * as Actions from "../Actions";
import { Account } from "../Shared/Model";
import {
  AuthenticationPayload,
  ChangePasswordPayload,
  CheckAccountWithEmailPayload,
  GetUserProfilePayload,
  RequestTokenPayload,
  SetPasswordPayload,
  UpdateUserProfilePayload,
  VerifyTokenPayload
} from "../Shared/Payload";
import { NetworkRequestState } from "../Shared/State";
import { handleActionsWithReset } from "../Utilities/ReduxUtilities";

export interface IAccountState {
  currentAccount: Account | null;
  userProfileState: UpdateUserProfilePayload;
  updateProfileState: UpdateUserProfilePayload;
  checkAccountWithEmailState: CheckAccountWithEmailPayload;
  changePasswordState: ChangePasswordPayload;
  requestTokenState: RequestTokenPayload;
  verifyTokenState: VerifyTokenPayload;
  setPasswordState: SetPasswordPayload;
  isAuthenticating: boolean;
  authenticationError?: any;
  isAuthenticatingWithFacebook: boolean;
  isAuthenticationCancelled: boolean;
}

const initialState: IAccountState = {
  currentAccount: null,
  userProfileState: {
    state: NetworkRequestState.NOT_STARTED
  },
  updateProfileState: {
    state: NetworkRequestState.NOT_STARTED
  },
  checkAccountWithEmailState: {
    state: NetworkRequestState.NOT_STARTED
  },
  changePasswordState: {
    state: NetworkRequestState.NOT_STARTED
  },
  requestTokenState: {
    state: NetworkRequestState.NOT_STARTED
  },
  verifyTokenState: {
    state: NetworkRequestState.NOT_STARTED
  },
  setPasswordState: {
    state: NetworkRequestState.NOT_STARTED
  },
  isAuthenticating: false,
  authenticationError: null,
  isAuthenticatingWithFacebook: false,
  isAuthenticationCancelled: false
};

export const AccountReducers = handleActionsWithReset<IAccountState, any>(
  {
    [`${Actions.updateSnkgAuthState}`]: (state: IAccountState, action: Action<AuthenticationPayload>) => ({
      ...state,
      currentAccount: action.payload.account || null,
      isAuthenticating: action.payload.state === NetworkRequestState.REQUESTING,
      authenticationError: action.payload.error
    }),
    [`${Actions.onPremAuthenticate}`]: (state: IAccountState, _action: Action<any>) => {
      return {
        ...state,
        isAuthenticating: true,
        authenticationError: null
      };
    },
    [`${Actions.cancelThirdPartyAuthentication}`]: (state: IAccountState, _action: Action<any>) => {
      return {
        ...state,
        isAuthenticationCancelled: true,
        isAuthenticating: false
      };
    },
    [`${Actions.authenticationComplete}`]: (state: IAccountState, action: Action<Account>) => {
      return {
        ...state,
        currentAccount: action.payload,
        isAuthenticating: false
      };
    },
    [`${Actions.authenticationError}`]: (state: IAccountState, action: Action<any>) => {
      return Object.assign(state, {
        authenticationError: action.payload,
        isAuthenticating: false
      });
    },
    [`${Actions.updateStateGetUserProfile}`]: (state: IAccountState, action: Action<GetUserProfilePayload>) => ({
      ...state,
      userProfileState: {
        ...state.userProfileState,
        ...action.payload
      }
    }),
    [`${Actions.updateStateUpdateUserProfile}`]: (state: IAccountState, action: Action<UpdateUserProfilePayload>) => ({
      ...state,
      updateProfileState: {
        ...state.updateProfileState,
        ...action.payload
      }
    }),
    [`${Actions.updateStateRequestToken}`]: (state: IAccountState, action: Action<RequestTokenPayload>) => ({
      ...state,
      requestTokenState: {
        ...state.requestTokenState,
        ...action.payload
      }
    }),
    [`${Actions.updateStateVerifyToken}`]: (state: IAccountState, action: Action<VerifyTokenPayload>) => ({
      ...state,
      verifyTokenState: {
        ...state.verifyTokenState,
        ...action.payload
      }
    }),
    [`${Actions.updateStateCheckAccountWithEmail}`]: (
      state: IAccountState,
      action: Action<CheckAccountWithEmailPayload>
    ) => ({
      ...state,
      checkAccountWithEmailState: {
        ...state.checkAccountWithEmailState,
        ...action.payload
      }
    }),
    [`${Actions.updateStateChangePassword}`]: (state: IAccountState, action: Action<ChangePasswordPayload>) => ({
      ...state,
      changePasswordState: {
        ...state.changePasswordState,
        ...action.payload
      }
    })
  },
  initialState
);
