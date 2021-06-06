// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { connect } from "react-redux";
import { IAppState } from "../../Store";
import { AppDialog } from "./AppDialog";
import { dismissDialog } from "../../Actions";

const mapStateToProps = (state: IAppState) => ({
  dialogMessage: state.DialogState.dialogMessage,
  isDialogOpen: state.DialogState.isDialogOpen
});

const mapDispatchToProps = (dispatch: Function) => ({
  dismissDialog: () => dispatch(dismissDialog())
});

export const AppDialogContainer = connect(mapStateToProps, mapDispatchToProps)(AppDialog);
