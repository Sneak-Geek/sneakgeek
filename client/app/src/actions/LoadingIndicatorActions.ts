import {createAction} from 'redux-actions';

export const LoadingIndicatorActions = {
  TOGGLE_INDICATOR: 'TOGGLE_INDICATOR',
};

export type IndicatorPayload = {isLoading: boolean; message: string};

export const toggleIndicator = createAction<IndicatorPayload>(
  LoadingIndicatorActions.TOGGLE_INDICATOR,
);
