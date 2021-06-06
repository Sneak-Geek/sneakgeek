//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { IAppState } from "../../Store";
import { OnboardingScreen } from "./OnboardingScreen";

const mapStateToProps = (_state: IAppState) => ({});

const mapDispatchToProps = (_dispatch: Function) => ({});

export const OnboardingScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingScreen);
