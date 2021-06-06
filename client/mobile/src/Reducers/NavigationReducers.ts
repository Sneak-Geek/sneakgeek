// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import AppNavigator from "../Navigation/NavigationConfig";
import { NavigationAction, NavigationActions, NavigationState, StackActions } from "react-navigation";
import { Action } from "redux-actions";
import { RouteNames } from "../Navigation/RouteNames";
import * as Actions from "../Actions";
const initialAction = AppNavigator.router.getActionForPathAndParams(RouteNames.Splash) as NavigationAction;
const initialState = AppNavigator.router.getStateForAction(initialAction);

export const NavigationReducers = (state: NavigationState = initialState, action: Action<any>) => {
  let nextState;
  switch (action.type) {
    case Actions.NavigationActions.NAVIGATE_TO_PREVIOUS_SCREEN:
      nextState = AppNavigator.router.getStateForAction(StackActions.pop({ n: 1 }), state);
      break;
    case Actions.NavigationActions.NAVIGATE_REPLACE_HOME:
    case Actions.AccountActions.AUTHENTICATION_COMPLETE:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: RouteNames.Tabs.TabRoot })]
        }),
        state
      );
      break;
    case Actions.NavigationActions.NAVIGATE_TO_LOGIN:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.replace({
          routeName: RouteNames.Authentication
        }),
        state
      );
      break;
    case Actions.NavigationActions.NAVIGATE_TO_EMAIL_SIGNIN:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.push({
          routeName: RouteNames.EmailSignIn,
          params: { email: action.payload }
        }),
        state
      );
      break;
    case Actions.NavigationActions.NAVIGATE_TO_REQUIRE_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.push({
          routeName: RouteNames.RequireSuccess
        }),
        state
      );
      break;
    case Actions.NavigationActions.NAVIGATE_TO_EMAIL_SIGNUP:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.push({
          routeName: RouteNames.EmailSignUp,
          params: { email: action.payload }
        }),
        state
      );
      break;
    case Actions.NavigationActions.NAVIGATE_TO_SELL_SCREEN:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.push({
          routeName: RouteNames.SellDetail,
          params: {
            shoeForSell: action.payload
          }
        }),
        state
      );
      break;
    case Actions.NavigationActions.NAVIGATE_TO_LOGIN_BY_LOGOUT:
      nextState = AppNavigator.router.getStateForAction(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: RouteNames.Authentication })]
        }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action as any, state);
  }

  return nextState || state;
};
