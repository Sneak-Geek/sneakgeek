import {Action} from 'redux-actions';
import {
  dismissNotification,
  showErrorNotification,
  showSuccessNotification,
} from 'actions';
import {handleActionsWithReset} from 'business';

export type Notifcation = {
  id: string;
  type: 'success' | 'error' | 'regular';
  message: string;
  timeout: number;
};

export interface INotificationState {
  notifications: Array<Notifcation>;
}

const initialState: INotificationState = {
  notifications: [],
};

export const NotificationReducers = handleActionsWithReset<
  INotificationState,
  any
>(
  {
    [`${showErrorNotification}`]: (
      state: INotificationState,
      action: Action<string>,
    ) => ({
      ...state,
      notifications: [
        ...state.notifications,
        {
          id: new Date().getTime().toString(),
          type: 'error',
          message: action.payload,
          timeout: 5,
        },
      ],
    }),
    [`${showSuccessNotification}`]: (
      state: INotificationState,
      action: Action<string>,
    ) => ({
      ...state,
      notifications: [
        ...state.notifications,
        {
          id: new Date().getTime().toString(),
          type: 'success',
          message: action.payload,
          timeout: 5,
        },
      ],
    }),
    [`${dismissNotification}`]: (
      state: INotificationState,
      action: Action<string>,
    ) => ({
      ...state,
      notifications: state.notifications.filter((t) => t.id !== action.payload),
    }),
  },
  initialState,
);
