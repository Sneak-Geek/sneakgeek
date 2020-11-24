import { NetworkRequestState, NotificationsPayload } from "../payload";
import { Notification } from "../model";
import { handleActionsWithReset } from "../utilities";
import { updateNotificationState } from "../actions";
import { Action } from "redux-actions";

export type IAppNotificationState = {
  state: NetworkRequestState;
  error?: any;
  notifications: Notification[];
}

export const initialNotificationState: IAppNotificationState = {
  state: NetworkRequestState.NOT_STARTED,
  notifications: new Array<Notification>()
};

export const AppNotificationReducers = handleActionsWithReset<IAppNotificationState, any>(
  {
    [`${updateNotificationState}`]: (_: IAppNotificationState, action: Action<NotificationsPayload>) => ({
      notifications: action.payload.data?.notifications || [],
      error: action.payload.error,
      state: action.payload.state
    })
  },
  initialNotificationState
);