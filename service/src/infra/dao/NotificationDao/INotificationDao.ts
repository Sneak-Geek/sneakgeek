import { ObjectId } from "mongodb";
import { Notification } from "../../database";
import { OrderType } from "../../../assets/constants";

export type INotificationInput = {
  profileId: ObjectId;
  title: string;
  body: string;
  notificationType: string;
  orderType: OrderType;
  orderId: ObjectId;
  imageUrl?: string;
};

export interface INotificationDao {
  createNotification(notification: Partial<INotificationInput>): Promise<Notification>;
  markNotificationsAsRead(profileId: ObjectId, notificationIds: string[]): Promise<void>;
  getNotifications(profileId: ObjectId): Promise<Notification[]>;
}
