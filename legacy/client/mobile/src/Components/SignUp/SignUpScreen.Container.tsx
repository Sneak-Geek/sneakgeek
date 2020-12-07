//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { SignUpScreen } from "./SignUpScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { NavigationActions } from "react-navigation";
import * as Actions from "../../Actions";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({

  emailSignup: async (email: string, password: string) => {
    let res = await dispatch(Actions.emailSignup(email, password));
    if (res) {
      dispatch(
        NavigationActions.navigate({
          routeName: RouteNames.UserKind,
        })
      );
    }
  },

  navigateToFotgotPassword: () => {
    dispatch(
      NavigationActions.navigate({
        routeName: RouteNames.ForgotPassword
      })
    );
  },
});

export const SignUpScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen);
