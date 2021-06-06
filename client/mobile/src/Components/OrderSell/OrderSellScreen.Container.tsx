//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { OrderSellScreen } from "./OrderSellScreen";
import { IAppState } from "../../Store";
import { RouteNames } from "../../Navigation";
import { NavigationActions } from "react-navigation";

const mapStateToProps = (_state: IAppState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({

    onEdit: () => {
        const navConfig = {
            routeName: RouteNames.TrackingSell,
        };
        dispatch(NavigationActions.navigate(navConfig));
    }
});

export const OrderSellScreenContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderSellScreen);
