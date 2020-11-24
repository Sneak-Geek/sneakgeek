//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { IAppState } from "../../Store";
import { PaymentOptionsScreen } from "./PaymentOptionsScreen";
import { NavigationActions } from "react-navigation";
import { RouteNames } from "../../Navigation";

const mapStateToProps = (state: IAppState) => ({
  account: state.AccountState.currentAccount,
  profile: state.AccountState.userProfileState.profile
});

const mapDispatchToProps = (dispatch: Function) => ({
  navigateToAddCard: () => {
    dispatch(
      NavigationActions.navigate({
        routeName: RouteNames.AddCard
      })
    );
  }
});

export const PaymentOptionsScreenContainer = connect(mapStateToProps, mapDispatchToProps)(PaymentOptionsScreen);
