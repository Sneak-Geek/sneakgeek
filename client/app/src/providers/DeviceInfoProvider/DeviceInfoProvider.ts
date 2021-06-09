import {Platform} from 'react-native';
import RNDeviceInfo from 'react-native-device-info';
import {IDeviceInfoProvider, DeviceInfo} from './IDeviceInfoProvider';

export class DeviceInfoProvider implements IDeviceInfoProvider {
  private _deviceInfo: DeviceInfo;

  public async getDeviceInfo(): Promise<DeviceInfo> {
    if (!this._deviceInfo) {
      this._deviceInfo = {
        OS: Platform.OS,
        deviceToken: await RNDeviceInfo.getDeviceToken(),
        pushPlatform: Platform.select({
          ios: 'APNS',
          android: 'GCM',
        }),
      };
    }

    return this._deviceInfo;
  }
}
