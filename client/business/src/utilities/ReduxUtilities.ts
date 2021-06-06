import { ReducerMap, ReduxCompatibleReducer, handleActions, Action } from "redux-actions";

export function handleActionsWithReset<State, Payload>(
  reducerMap: ReducerMap<State, Payload>,
  initialState: State
): ReduxCompatibleReducer<State, Payload> {
  const originalReducer = handleActions(reducerMap, initialState);

  return (state: State | undefined, action: Action<Payload>): State => {
    if (action.type === "RESET") {
      return initialState;
    }

    return originalReducer(state, action);
  };
}
