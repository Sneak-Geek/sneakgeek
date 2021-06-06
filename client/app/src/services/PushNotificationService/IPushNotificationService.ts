export interface IPushNotificationService {
  initializeListeners(): void;
  registerDevice(authToken: string): Promise<void>;
  unregisterDevice(authToken: string): void;
  deviceToken: string;
}
