//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { NotiSettingScreen } from "./NotiSettingScreen";
import { IAppState } from "../../Store";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (_dispatch: Function) => ({});

export const NotiSettingScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NotiSettingScreen);
