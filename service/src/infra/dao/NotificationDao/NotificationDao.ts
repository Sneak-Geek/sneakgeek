import { INotificationDao, INotificationInput } from "./INotificationDao";
import { inject, injectable } from "inversify";
import { Types } from "../../../configuration/inversify";
import { Repository, Notification } from "../../../infra/database";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

@injectable()
export class NotificationDao implements INotificationDao {
  @inject(Types.NotificationRepository)
  private notificationRepo!: Repository<Notification>;

  public createNotification(notification: INotificationInput): Promise<Notification> {
    return this.notificationRepo.create({
      profileId: notification.profileId,
      title: notification.title,
      body: notification.body,
      orderType: notification.orderType,
      notificationType: notification.notificationType,
      orderId: notification.orderId,
      imageUrl: notification.imageUrl,
    });
  }

  public markNotificationsAsRead(
    profileId: ObjectId,
    notificationIds: string[]
  ): Promise<void> {
    return this.notificationRepo
      .updateMany(
        {
          profileId: profileId,
          _id: { $in: notificationIds.map(mongoose.Types.ObjectId) },
        },
        {
          $set: {
            isRead: true,
          },
        }
      )
      .exec();
  }

  public getNotifications(profileId: ObjectId): Promise<Notification[]> {
    return this.notificationRepo.find({ profileId }).sort({ createdAt: -1 }).exec();
  }
}
