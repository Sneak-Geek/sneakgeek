import { OrderType } from "../loader";

export enum NotificationType {
  SELL_ORDER_SUCCESS = "SELL_ORDER_SUCCESS",
  SELL_ORDER_PRICE_UPDATE = "BUY_ORDER_MATCHED",
}

export type Notification = {
  _id: string;
  profileId: string;
  title: string;
  body: string;
  notificationType: NotificationType;
  orderType: OrderType;
  orderId: string;
  isRead: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}