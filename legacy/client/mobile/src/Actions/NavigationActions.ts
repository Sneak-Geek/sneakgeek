// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { createAction } from "redux-actions";
import { Shoe } from "../Shared/Model";

export const NavigationActions = {
  NAVIGATE_REPLACE_HOME: "NAVIGATE_REPLACE_HOME",
  NAVIGATE_TO_LOGIN: "NAVIGATE_TO_LOGIN",
  NAVIGATE_TO_EMAIL_SIGNIN: "NAVIGATE_TO_EMAIL_SIGNIN",
  NAVIGATE_TO_EMAIL_SIGNUP: "NAVIGATE_TO_EMAIL_SIGNUP",
  NAVIGATE_TO_SELL_SCREEN: "NAVIGATE_TO_SELL_SCREEN",
  NAVIGATE_TO_REQUIRE_SUCCESS: "NAVIGATE_TO_REQUIRE_SUCCESS",
  NAVIGATE_TO_PREVIOUS_SCREEN: "NAVIGATE_TO_PREVIOUS_SCREEN",
  NAVIGATE_TO_LOGIN_BY_LOGOUT: "NAVIGATE_TO_LOGIN_BY_LOGOUT"
};

export const navigateReplaceToHome = createAction(NavigationActions.NAVIGATE_REPLACE_HOME);
export const navigateToLogin = createAction(NavigationActions.NAVIGATE_TO_LOGIN);
export const navigateToEmailSignIn = createAction<string>(NavigationActions.NAVIGATE_TO_EMAIL_SIGNIN);
export const navigateToEmailSignUp = createAction<string>(NavigationActions.NAVIGATE_TO_EMAIL_SIGNUP);
export const navigateToSellScreen = createAction<Shoe>(NavigationActions.NAVIGATE_TO_SELL_SCREEN);
export const navigateToPreviousScreen = createAction(NavigationActions.NAVIGATE_TO_PREVIOUS_SCREEN);
export const navigateToLoginByLogout = createAction(NavigationActions.NAVIGATE_TO_LOGIN_BY_LOGOUT);
