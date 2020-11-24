// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { createAction } from "redux-actions";

export const DialogActions = {
  SHOW_DIALOG_WITH_MESSAGE: "SHOW_DIALOG_WITH_MESSAGE",
  DISMISS_DIALOG: "DISMISS_DIALOG"
};

export const dismissDialog = createAction(DialogActions.DISMISS_DIALOG);
export const showDialogWithMessage = createAction<string>(DialogActions.SHOW_DIALOG_WITH_MESSAGE);
