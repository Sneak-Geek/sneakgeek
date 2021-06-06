//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { ContactInfoScreen } from "./ContactInfoScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { NavigationActions } from "react-navigation";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({
  navigateToSendRequireSuccess: () => {
    const navConfig = {
      routeName: RouteNames.SendRequireSuccess,
    };
    dispatch(NavigationActions.navigate(navConfig));
  }
});

export const ContactInfoScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInfoScreen);
