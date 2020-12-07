// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { IAppState } from "../../Store";
import { SellDetailScreen } from "./SellDetailScreen";
import { sellShoes } from "../../Actions/TransactionActions";
import { Transaction } from "../../Shared/Model";
import { showNotification } from "../../Actions";

const mapStateToProps = (state: IAppState) => ({
  transactionState: state.TransactionState
});

const mapDispatchToProps = (dispatch: Function) => {
  return {
    sellShoe: async (shoeOrder: Transaction) => {
      await dispatch(sellShoes(shoeOrder));
    },

    showNotification: (notification: string) => {
      dispatch(showNotification(notification));
    }
  };
};

export const SellDetailScreenContainer = connect(mapStateToProps, mapDispatchToProps)(SellDetailScreen);
