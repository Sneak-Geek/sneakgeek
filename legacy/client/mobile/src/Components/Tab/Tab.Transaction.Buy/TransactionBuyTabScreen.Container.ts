// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { IAppState } from "../../../Store";
import { TransactionBuyTabScreen } from "./TransactionBuyTabScreen";
import { getBuyHistory } from "../../../Actions";

const mapStateToProps = (state: IAppState) => ({
  buyOrderHistoryState: state.TransactionState.buyOrderHistoryState
});

const mapDispatchToProps = (dispatch: (param: any) => void) => ({
  getBuyHistory: () => {
    dispatch(getBuyHistory());
  }
});

export const TransactionBuyTabScreenContainer = connect(mapStateToProps, mapDispatchToProps)(TransactionBuyTabScreen);
