import {handleActionsWithReset} from 'business';
import {toggleIndicator, IndicatorPayload} from 'actions';
import {Action} from 'redux-actions';

export interface ILoadingIndicatorState {
  isLoading: boolean;
  message?: string;
}

const initialState: ILoadingIndicatorState = {
  isLoading: false,
};

export const LoadingIndicatorReducers = handleActionsWithReset<
  ILoadingIndicatorState,
  any
>(
  {
    [`${toggleIndicator}`]: (
      state: ILoadingIndicatorState,
      action: Action<IndicatorPayload>,
    ) => ({
      ...state,
      ...action.payload,
    }),
  },
  initialState,
);
