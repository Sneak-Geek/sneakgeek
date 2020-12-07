// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { TabUserEditScreen } from "./TabUserEditScreen";
import { IAppState } from "../../../Store";
import { Profile } from "../../../Shared/Model";
import { updateUserProfile } from "../../../Actions";

const mapStateToProps = (state: IAppState) => ({
  profile: state.AccountState.userProfileState.profile,
  updateProfileState: state.AccountState.updateProfileState
});

const mapDispatchToProps = (dispatch: Function) => ({
  updateProfile: (data: Partial<Profile>) => dispatch(updateUserProfile(data))
});

export const TabUserEditScreenContainer = connect(mapStateToProps, mapDispatchToProps)(TabUserEditScreen);
