//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { ShoeSizeScreen } from "./ShoeSizeScreen";
import { IAppState } from "../../Store";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (_dispatch: Function) => ({});

export const ShoeSizeScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoeSizeScreen);
