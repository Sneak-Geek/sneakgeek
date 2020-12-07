import { createAction } from "redux-actions";
import { NotificationsPayload, NetworkRequestState } from "../payload";
import { ObjectFactory, ISettingsProvider, FactoryKeys } from "..";
import { INotificationService } from "../loader/services/NotificationService/INotificationService";
import { SettingsKey } from "../loader";

export const NotificationActions = {
  UPDATE_NOTIFICATION_STATE: "UPDATE_NOTIFICATION_STATE"
};

export const updateNotificationState = createAction<NotificationsPayload>(NotificationActions.UPDATE_NOTIFICATION_STATE);

export const getNotification = () => {
  return async (dispatch: Function) => {
    dispatch(updateNotificationState({
      state: NetworkRequestState.REQUESTING
    }));

    const notificationService = ObjectFactory.getObjectInstance<INotificationService>(FactoryKeys.INotificationService);
    const settings = ObjectFactory.getObjectInstance<ISettingsProvider>(
      FactoryKeys.ISettingsProvider
    );
    const token = settings.getValue(SettingsKey.CurrentAccessToken);

    try {
      const notifications = await notificationService.getNotifications(token);
      dispatch(
        updateNotificationState({
          state: NetworkRequestState.SUCCESS,
          data: { notifications }
        })
      );
    } catch (error) {
      dispatch(updateNotificationState({
        state: NetworkRequestState.FAILED,
        error
      }));
    }
  }
};