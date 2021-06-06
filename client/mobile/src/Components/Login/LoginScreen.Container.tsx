//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { IAppState } from "../../Store";
import * as Actions from "../../Actions";
import LoginScreen from "./LoginScreen";
import { StackActions } from "react-navigation";
import { RouteNames } from "../../Navigation/RouteNames";
import { ModalTypes } from "../Modal/ModalTypes";

const mapStateToProps = (state: IAppState) => {
  const AccountState = state.AccountState;
  return {
    currentAccount: AccountState.currentAccount,
    isAuthenticating: AccountState.isAuthenticating,
    authenticationError: AccountState.authenticationError,
    isAuthenticatingWithFacebook: AccountState.isAuthenticatingWithFacebook,
    isAuthenticationCancelled: AccountState.isAuthenticationCancelled,
    checkAccountWithEmailState: AccountState.checkAccountWithEmailState
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    facebookLogin: () => {
      dispatch(Actions.authenticate("facebook"));
    },

    googleLogin: () => {
      dispatch(Actions.authenticate("google"));
    },

    navigateToHome: () => {
      dispatch(StackActions.replace({ routeName: RouteNames.Tabs.TabRoot }));
    },

    displayDebugDialog: () => {
      dispatch(Actions.displayModal({ modalType: ModalTypes.Debug, data: {} }));
    },

    checkEmailExists: (email: string) => {
      dispatch(Actions.checkAccountWithEmail(email));
    }
  };
};

export const LoginScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
