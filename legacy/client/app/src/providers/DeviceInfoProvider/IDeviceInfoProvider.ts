export type DeviceInfo = {
  OS: string;
  pushPlatform: string;
  deviceToken: string;
};

export interface IDeviceInfoProvider {
  getDeviceInfo(): Promise<DeviceInfo>;
}
