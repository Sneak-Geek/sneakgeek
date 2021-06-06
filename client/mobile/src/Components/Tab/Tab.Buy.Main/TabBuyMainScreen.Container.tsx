//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import TabBuyMainScreen from "./TabBuyMainScreen";
import { IAppState } from "../../../Store";

const mapStateToProps = (state: IAppState) => {
  return {
    shoes: state.AppContentState.shoes
  };
};

export const TabBuyMainScreenContainer = connect(mapStateToProps)(TabBuyMainScreen);
