import {createAction} from 'redux-actions';

export const NotifcationActions = {
  SHOW_ERROR_NOTIFICATION: 'SHOW_ERROR_NOTIFICATION',
  SHOW_SUCCESS_NOTIFICATION: 'SHOW_SUCCESS_NOTIFICATION',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
};

export const showErrorNotification = createAction<string>(
  NotifcationActions.SHOW_ERROR_NOTIFICATION,
);
export const showSuccessNotification = createAction<string>(
  NotifcationActions.SHOW_SUCCESS_NOTIFICATION,
);
export const dismissNotification = createAction<string>(
  NotifcationActions.DISMISS_NOTIFICATION,
);
