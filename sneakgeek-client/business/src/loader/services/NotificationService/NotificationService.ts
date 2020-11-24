import { INotificationService } from "./INotificationService";
import { BaseService } from "../BaseService";
import { Notification } from "../../../model";

export class NotificationService extends BaseService implements INotificationService {
  public async getNotifications(token: string): Promise<Notification[]> {
    const result = await this.apiClient.getInstance().get("/notification", {
      headers: {
        authorization: token
      }
    });

    return result.data.notifications;
  }
  public markAsRead(token: string, notifications: string[]): Promise<void> {
    return this.apiClient.getInstance().patch("/notification",
      {
        notifications: notifications.join(",")
      },
      {
        headers: {
          authorization: token
        }
      }
    );
  }
}