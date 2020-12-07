//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { TabUserSearchScreen } from "./TabUserSearchScreen";
import { IAppState } from "../../../Store";
import { RouteNames } from "../../../Navigation";
import { NavigationActions } from "react-navigation";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({
  navigateToSendRequireSuccess: () => {
    const navConfig = {
      routeName: RouteNames.SendRequireSuccess,
    };
    dispatch(NavigationActions.navigate(navConfig));
  },
  back: () => {
    dispatch(NavigationActions.back());
  }
});

export const TabUserSearchScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TabUserSearchScreen);
