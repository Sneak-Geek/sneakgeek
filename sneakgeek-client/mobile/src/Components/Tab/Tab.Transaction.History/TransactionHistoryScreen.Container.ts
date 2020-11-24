//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { IAppState } from "../../../Store";
import { TransactionHistoryScreen } from "./TransactionHistoryScreen";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (_dispatch: Function) => ({});

export const TransactionHistoryScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionHistoryScreen);
