// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action } from "redux-actions";
import { dismissDialog, showDialogWithMessage } from "../Actions";
import { handleActionsWithReset } from "../Utilities/ReduxUtilities";

export interface IDialogState {
  isDialogOpen: boolean;
  dialogMessage: string;
}

const initialState: IDialogState = {
  isDialogOpen: false,
  dialogMessage: ""
};

export const DialogReducers = handleActionsWithReset<IDialogState, any>(
  {
    [`${showDialogWithMessage}`]: (state: IDialogState, action: Action<string>) => ({
      ...state,
      isDialogOpen: true,
      dialogMessage: action.payload
    }),
    [`${dismissDialog}`]: (state: IDialogState, _: Action<any>) => ({
      ...state,
      isDialogOpen: false
    })
  },
  initialState
);
