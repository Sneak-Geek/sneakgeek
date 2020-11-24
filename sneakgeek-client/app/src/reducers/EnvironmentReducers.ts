import {DeviceInfo} from 'providers';
import {handleActionsWithReset} from 'business';
import {
  updateDeviceInfo,
  updateNotificationRegistered,
  updatePushDeviceToken,
} from 'actions';
import {Action} from 'redux-actions';

export interface IEnvironmentState {
  deviceInfo: DeviceInfo;
  pushDeviceToken: string;
  notificationRegistered: boolean;
}

const initialState: IEnvironmentState = {
  deviceInfo: null,
  pushDeviceToken: '',
  notificationRegistered: false,
};

export const EnvironmentReducers = handleActionsWithReset<
  IEnvironmentState,
  any
>(
  {
    [`${updateDeviceInfo}`]: (
      state: IEnvironmentState,
      action: Action<DeviceInfo>,
    ) => ({
      ...state,
      deviceInfo: action.payload,
    }),
    [`${updateNotificationRegistered}`]: (
      state: IEnvironmentState,
      action: Action<boolean>,
    ) => ({
      ...state,
      notificationRegistered: action.payload,
    }),
    [`${updatePushDeviceToken}`]: (
      state: IEnvironmentState,
      action: Action<string>,
    ) => ({
      ...state,
      pushDeviceToken: action.payload,
    }),
  },
  initialState,
);
