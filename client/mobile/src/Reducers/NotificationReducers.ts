// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Action } from "redux-actions";
import { dismissNotification, showNotification } from "../Actions";
import uuid from "uuid";
import { handleActionsWithReset } from "../Utilities/ReduxUtilities";

export interface INotificationState {
  notifications: Array<{
    id: string;
    message: string;
    timeout: number;
  }>;
}

const initialState: INotificationState = {
  notifications: [
    {
      id: "1234",
      message: "Hello",
      timeout: 5
    }
  ]
};

export const NotificationReducers = handleActionsWithReset<INotificationState, any>(
  {
    [`${showNotification}`]: (state: INotificationState, action: Action<string>) => ({
      ...state,
      notifications: [...state.notifications, { id: uuid.v1(), message: action.payload, timeout: 5 }]
    }),
    [`${dismissNotification}`]: (state: INotificationState, action: Action<string>) => ({
      ...state,
      notifications: state.notifications.filter(t => t.id !== action.payload)
    })
  },
  initialState
);
