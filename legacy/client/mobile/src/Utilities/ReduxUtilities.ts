// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action, handleActions, ReducerMap, ReduxCompatibleReducer } from "redux-actions";
import * as Actions from "../Actions";

export function handleActionsWithReset<State, Payload>(
  reducerMap: ReducerMap<State, Payload>,
  initialState: State
): ReduxCompatibleReducer<State, Payload> {
  const originalReducer = handleActions(reducerMap, initialState);

  return (state: State | undefined, action: Action<Payload>): State => {
    if (action.type === Actions.BaseActions.RESET_ACTION) {
      return initialState;
    }

    return originalReducer(state, action);
  };
}

export function pending(action: string | object) {
  return `${action}_PENDING`;
}

export function fulfilled(actionName: string | object) {
  return `${actionName}_FULFILLED`;
}

export function rejected(actionName: string | object) {
  return `${actionName}_REJECTED`;
}
