//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { IAppState } from "../../../Store";
import { TabHomeMainScreen } from "./TabHomeMainScreen";
import { fetchShoes } from "../../../Actions";
import { RouteNames } from "../../../Navigation";
import { Shoe } from "../../../Shared/Model";
import { NavigationActions } from "react-navigation";

const mapStateToProps = (state: IAppState) => ({
  shoes: state.AppContentState.shoes
});

const mapDispatchToProps = (dispatch: Function) => {
  return {
    fetchShoes: () => dispatch(fetchShoes()),
    navigateToShoeDetail: (shoe: Shoe) => {
      const navConfig = {
        routeName: RouteNames.ShoeDetail,
        params: { shoe }
      };
      dispatch(NavigationActions.navigate(navConfig));
    },
    navigateToSeeMore: (title: string, shoeData: Shoe[]) => {
      const navConfig = {
        routeName: RouteNames.SeeMore,
        params: {
          title,
          shoes: shoeData
        }
      };
      dispatch(NavigationActions.navigate(navConfig));
    }
  };
};

export const TabHomeMainScreenContainer = connect(mapStateToProps, mapDispatchToProps)(TabHomeMainScreen);
