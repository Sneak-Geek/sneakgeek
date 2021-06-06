//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { TrackingSellScreen } from "./TrackingSellScreen";
import { IAppState } from "../../Store";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (_dispatch: Function) => ({});

export const TrackingSellScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackingSellScreen);
