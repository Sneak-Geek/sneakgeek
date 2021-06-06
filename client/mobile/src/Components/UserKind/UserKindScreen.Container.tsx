// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { UserKindScreen } from "./UserKindScreen";
import { IAppState } from "../../Store";
import { StackActions } from "react-navigation";
const mapStateToProps = (_state: IAppState) => ({});

const mapDispatchToProps = (dispatch: Function) => ({
  navigateToHome: () => {
    dispatch(StackActions.pop({ n: 1 }));
  }
});

export const UserKindScreenContainer = connect(mapStateToProps, mapDispatchToProps)(UserKindScreen);
