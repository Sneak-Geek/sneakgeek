// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { ChangePasswordScreen } from "./ChangePasswordScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { NavigationActions } from "react-navigation";
import * as Actions from "../../Actions";

const mapStateToProps = (state: IAppState) => ({
  changePasswordState: state.AccountState.changePasswordState.state
});
const mapDispatchToProps = (dispatch: Function) => ({
  navigateToRequireSuccess: () => {
    const navConfig = {
      routeName: RouteNames.RequireSuccess
    };
    dispatch(NavigationActions.navigate(navConfig));
  },

  onChangePassword: (currentPassword: string, newPassword: string) => {
    dispatch(Actions.changePassword(currentPassword, newPassword));
  }
});

export const ChangePasswordScreenContainer = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);
