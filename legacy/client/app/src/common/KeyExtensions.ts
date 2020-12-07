import {FactoryKeys} from 'business';

export const KeyExtensions = {
  ...FactoryKeys,
  IDeviceInfoProvider: Symbol.for('IDeviceInfoProvider'),
  IPushNotificationService: Symbol.for('IPushNotificationService'),
};
