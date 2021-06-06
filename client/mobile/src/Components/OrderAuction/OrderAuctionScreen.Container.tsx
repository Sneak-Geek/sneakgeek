// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { OrderAuctionScreen } from "./OrderAuctionScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { NavigationActions } from "react-navigation";

const mapStateToProps = (_: IAppState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({
  onEdit: () => {
    const navConfig = {
      routeName: RouteNames.TrackingSell
    };
    dispatch(NavigationActions.navigate(navConfig));
  },

  navigateToPayment: () => {
    const navConfig = {
      routeName: RouteNames.Payment
    };
    dispatch(NavigationActions.navigate(navConfig));
  }
});

export const OrderAuctionScreenContainer = connect(mapStateToProps, mapDispatchToProps)(OrderAuctionScreen);
