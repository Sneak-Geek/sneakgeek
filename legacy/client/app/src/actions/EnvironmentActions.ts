import {createAction} from 'redux-actions';
import {DeviceInfo} from 'providers';

export const EnvironmentActions = {
  UPDATE_DEVICE_INFO: 'UPDATE_DEVICE_INFO',
  UPDATE_NOTIFICATION_REGISTERED: 'UPDATE_NOTIFICATION_REGISTERED',
  UPDATE_PUSH_DEVICE_TOKEN: 'UPDATE_PUSH_DEVICE_TOKEN',
};

export const updateDeviceInfo = createAction<DeviceInfo>(
  EnvironmentActions.UPDATE_DEVICE_INFO,
);
export const updateNotificationRegistered = createAction<boolean>(
  EnvironmentActions.UPDATE_NOTIFICATION_REGISTERED,
);
export const updatePushDeviceToken = createAction<string>(
  EnvironmentActions.UPDATE_PUSH_DEVICE_TOKEN,
);
