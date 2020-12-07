import {
  INotificationService,
  INotificationBuilder,
  ApnsNotificationSchema,
} from "../../../src/infra/services";
import { injectable } from "inversify";

@injectable()
export class NotificationServiceMock implements INotificationService {
  registerDevice(
    userProfileId: string,
    installationId: string,
    platform: string,
    pushChannel: string
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
  sendNotification<T>(tag: string, body: ApnsNotificationSchema<T>): Promise<any> {
    throw new Error("Method not implemented.");
  }

  builder: INotificationBuilder;
}
