//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { ForgotPasswordScreen } from "./ForgotPasswordScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { StackActions } from "react-navigation";
import * as Actions from "../../Actions";

const mapStateToProps = (state: IAppState) => ({
  requestTokenState: state.AccountState.requestTokenState.state,
  verifyTokenState: state.AccountState.verifyTokenState.state
});

const mapDispatchToProps = (dispatch: Function) => ({
  requestTokenConfirm: (email: string) => {
    dispatch(Actions.requestTokenConfirm(email));
  },

  verifyToken: (email: string, verificationToken: string) => {
    dispatch(Actions.verifyToken(email, verificationToken));
  },

  setNewPassword: (email: string, verificationToken: string, newPassword: string) => {
    dispatch(Actions.setNewPassword(email, verificationToken, newPassword));
  },

  navigateToHome: () => {
    dispatch(
      StackActions.replace({
        routeName: RouteNames.Tabs.TabRoot
      })
    );
  }
});

export const ForgotPasswordScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordScreen);
