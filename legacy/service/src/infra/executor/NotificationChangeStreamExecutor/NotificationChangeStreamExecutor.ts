import { injectable, inject } from "inversify";
import { Types } from "../../../configuration/inversify";
import { INotificationChangeStreamExecutor } from "./INotificationChangeStreamExecutor";
import { INotificationService } from "../../../infra/services";
import { Notification } from "../../../infra/database";

@injectable()
export class NotificationChangeStreamExecutor implements INotificationChangeStreamExecutor {
  @inject(Types.NotificationService)
  private notificationService!: INotificationService;

  public executeOnNotificationInsert(data: any): Promise<void> {
    const fullDocument = data.fullDocument as Notification;
    const builder = this.notificationService.builder
      .setTitle(fullDocument.title)
      .setBody(fullDocument.body)
      .setNotificationType(fullDocument.notificationType)
      .setOrderType(fullDocument.orderType)
      .setOrderId(fullDocument.orderId);

    const notification = builder.build();
    return this.notificationService.sendNotification(
      fullDocument.profileId.toHexString(),
      notification
    );
  }
}
