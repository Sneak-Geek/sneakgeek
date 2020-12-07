//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { AddCardScreen } from "./AddCardScreen";
import { IAppState } from "../../Store";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (_dispatch: Function) => ({});

export const AddCardScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCardScreen);
