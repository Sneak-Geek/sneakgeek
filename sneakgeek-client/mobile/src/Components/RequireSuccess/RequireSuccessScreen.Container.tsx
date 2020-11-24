//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { RequireSuccessScreen } from "./RequireSuccessScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { StackActions } from "react-navigation";

const mapStateToProps = (state: IAppState) => {
  return {
    shoes: state.AppContentState.shoes,
    account: state.AccountState.currentAccount,
    profile: state.AccountState.userProfileState.profile,
    routeIndex: state.NavigationState.index
  };
};

const mapDispatchToProps = (dispatch: Function) => {
  return {
    navigateToHome: () => {
      dispatch(StackActions.replace({ routeName: RouteNames.Tabs.TabRoot }));
    },
  };
};

export const RequireSuccessScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RequireSuccessScreen);
