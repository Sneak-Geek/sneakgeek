//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { ShoeRequireScreen } from "./ShoeRequireScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { NavigationActions } from "react-navigation";
import * as Actions from "../../Actions";

const mapStateToProps = (state: IAppState) => ({
    requestProductState: state.AppContentState.requestProductState.state
});

const mapDispatchToProps = (dispatch: Function) => ({
  navigateToRequireSuccess: (shoeName: String) => {
    const navConfig = {
      routeName: RouteNames.RequireSuccess,
      params: {shoeName}
    };
    dispatch(NavigationActions.navigate(navConfig));
  },

  sendRequestProduct: (title: string, brand: string,
    //  gender: string, colorways: string[], productLink: string, imageUrls: string[]
     ) => {
    dispatch(Actions.requestProduct(
      title, brand, 
      // gender, colorways, productLink, imageUrls
      ));
  }
});

export const ShoeRequireScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShoeRequireScreen);
