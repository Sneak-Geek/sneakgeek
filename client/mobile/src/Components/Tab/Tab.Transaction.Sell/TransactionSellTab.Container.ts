// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { IAppState } from "../../../Store";
import { TransactionSellTab } from "./TransactionSellTab";
import { getSellHistory } from "../../../Actions";
import { RouteNames } from "../../../Navigation";
import { NavigationActions } from "react-navigation";

const mapStateToProps = (state: IAppState) => ({
  sellHistoryState: state.TransactionState.sellOrderHistoryState
});

const mapDispatchToProps = (dispatch: (param: any) => void) => ({
  getSellHistory: () => {
    dispatch(getSellHistory());
  },

  navigateToSearch: () => {
    const navConfig = {
      routeName: RouteNames.Tabs.SearchTab,
      params: { isForSell: true }
    };
    dispatch(NavigationActions.navigate(navConfig));
  },

  onShoeClick: () => {
    const navConfig = {
      routeName: RouteNames.OrderSell
    };
    dispatch(NavigationActions.navigate(navConfig));
  }
});

export const TransactionSellTabContainer = connect(mapStateToProps, mapDispatchToProps)(TransactionSellTab);
