import RNNotification, {
  PushNotification,
} from '@react-native-community/push-notification-ios';
import {IPushNotificationService} from './IPushNotificationService';
import {BaseService} from 'business';
import {AppStore} from 'store/AppStore';
import {updatePushDeviceToken} from 'actions';
import {getDependency} from 'utilities';
import {IDeviceInfoProvider} from 'providers';
import {KeyExtensions} from 'common';

export class PushNotificationService extends BaseService
  implements IPushNotificationService {
  private _deviceToken: string = '';

  public initializeListeners(): void {
    RNNotification.requestPermissions();
    RNNotification.addEventListener('register', this._onRegistered.bind(this));
    RNNotification.addEventListener(
      'registrationError',
      this._onRegistrationError.bind(this),
    );
    RNNotification.addEventListener(
      'notification',
      this._onRemoteNotification.bind(this),
    );
    RNNotification.addEventListener(
      'localNotification',
      this._onLocalNotification.bind(this),
    );
  }

  public async registerDevice(token: string): Promise<void> {
    const deviceInfoProvider = getDependency<IDeviceInfoProvider>(
      KeyExtensions.IDeviceInfoProvider,
    );
    const deviceInfo = await deviceInfoProvider.getDeviceInfo();
    await this.apiClient.getInstance().post(
      '/profile/notification/register',
      {
        platform: deviceInfo.pushPlatform,
        pushChannel: this._deviceToken,
      },
      {
        headers: {
          authorization: token,
        },
      },
    );
  }

  public unregisterDevice(): void {
    return;
  }

  public get deviceToken(): string {
    return this._deviceToken;
  }

  private _onRegistered(deviceToken: string) {
    console.log('Device registered for push notification', deviceToken);
    this._deviceToken = deviceToken;

    // This is an unexpected side-effect,
    // can be fix if initialize listeners is taking adidtional paramameter(s)
    AppStore.dispatch(updatePushDeviceToken(deviceToken));
  }

  private _onRegistrationError(error: any) {
    console.log('Error on registering notification', error);
  }

  private _onRemoteNotification(notification: PushNotification) {
    console.log('Remote notification received', notification);
  }

  private _onLocalNotification(notification: PushNotification) {
    console.log('Local notification received', notification);
  }
}
