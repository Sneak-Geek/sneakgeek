import {createAction} from 'redux-actions';
import {batch} from 'react-redux';
import {getCurrentUser} from 'business';
import {getDependency} from 'utilities';
import {IDeviceInfoProvider} from 'providers';
import {KeyExtensions} from 'common';
import {updateDeviceInfo} from './EnvironmentActions';
import {IPushNotificationService} from 'services';

export const BaseActions = {
  RESET: 'RESET',
};

export const reset = createAction(BaseActions.RESET);

export const bootstrap = () => {
  return async (dispatch: Function) => {
    const deviceInfoProvider = getDependency<IDeviceInfoProvider>(
      KeyExtensions.IDeviceInfoProvider,
    );
    const deviceInfo = await deviceInfoProvider.getDeviceInfo();

    batch(() => {
      const notificationProvider = getDependency<IPushNotificationService>(
        KeyExtensions.IPushNotificationService,
      );
      notificationProvider.initializeListeners();
      dispatch(updateDeviceInfo(deviceInfo));
      dispatch(getCurrentUser());
    });
  };
};
