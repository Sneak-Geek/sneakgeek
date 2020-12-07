import { createAction } from "redux-actions";

export const BaseActions = {
  RESET_ACTION: "RESET_ACTION"
};

export const reset = createAction(BaseActions.RESET_ACTION);
