//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { connect } from "react-redux";
import { authenticateWithEmail } from "business";
import UnconnectedLoginScreen from "./LoginScreen";
import { IAppState } from "../../store/IAppState";

const mapDispatchToProps = (dispatch: Function) => ({
  emailLogin: (email: string, password: string) => {
    dispatch(authenticateWithEmail(email, password));
  }
});

export const LoginScreenContainer = connect(
  null,
  mapDispatchToProps
)(UnconnectedLoginScreen);
