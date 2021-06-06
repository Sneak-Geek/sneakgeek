//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { ShareScreen } from "./ShareScreen";
import { IAppState } from "../../Store";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (_dispatch: Function) => ({});

export const ShareScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareScreen);
