// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { IAppState } from "../../Store";
import { connect } from "react-redux";
import { BuySelectionScreen } from "./BuySelectionScreen";
import { NavigationActions } from "react-navigation";
import { RouteNames } from "../../Navigation";
import { SellOrder } from "../../Shared/Model";

const mapStateToProps = (state: IAppState) => ({
  availableSellOrders: state.TransactionState.availableSellOrdersState?.sellOrders
});

const mapDispatchToProps = (dispatch: Function) => ({
  navigateToPayment: (order?: SellOrder) => {
    dispatch(
      NavigationActions.navigate({
        routeName: RouteNames.Payment,
        params: { order }
      })
    );
  }
});

export const BuySelectionScreenContainer = connect(mapStateToProps, mapDispatchToProps)(BuySelectionScreen);
