import { Notification } from "../../../model";

export interface INotificationService {
  getNotifications(token: string): Promise<Notification[]>;
  markAsRead(token: string, notifications: string[]): Promise<void>;
}