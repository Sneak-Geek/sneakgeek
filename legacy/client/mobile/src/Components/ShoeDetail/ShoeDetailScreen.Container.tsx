// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { ShoeDetailScreen } from "./ShoeDetailScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { StackActions } from "react-navigation";
import { Shoe } from "../../Shared/Model";
import { addOwnedShoe, getAvailableSellOrders, navigateToSellScreen, showDialogWithMessage } from "../../Actions";

const mapStateToProps = (state: IAppState) => {
  return {
    shoes: state.AppContentState.shoes,
    account: state.AccountState.currentAccount,
    profile: state.AccountState.userProfileState.profile,
    routeIndex: state.NavigationState.index,
    availableSellOrdersState: state.TransactionState.availableSellOrdersState
  };
};

const mapDispatchToProps = (dispatch: (param: any) => void) => {
  return {
    getAvailableOrders: (shoeId: string) => {
      dispatch(getAvailableSellOrders(shoeId));
    },

    navigateToShoeDetailWithReset: (_: number, shoe: Shoe) => {
      const navConfig = {
        routeName: RouteNames.ShoeDetail,
        params: { shoe }
      };
      dispatch(StackActions.push(navConfig));
    },

    addOwnedShoe: (shoeId: string, owned: Array<{ shoeSize: string; number: number }>) => {
      dispatch(addOwnedShoe(shoeId, owned));
    },

    navigateToAuctionOrder: () => {
      const navConfig = {
        routeName: RouteNames.OrderAuction
      };
      dispatch(StackActions.push(navConfig));
    },

    navigateToSellScreen: (shoe: Shoe) => {
      dispatch(navigateToSellScreen(shoe));
    },

    navigateToBuySelection: (isOldCondition: boolean) => {
      dispatch(
        StackActions.push({
          routeName: RouteNames.BuySelection,
          params: { isOldCondition }
        })
      );
    },

    alert: (message: string) => {
      dispatch(showDialogWithMessage(message));
    }
  };
};

export const ShoeDetailScreenContainer = connect(mapStateToProps, mapDispatchToProps)(ShoeDetailScreen);
