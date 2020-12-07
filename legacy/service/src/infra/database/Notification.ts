import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { NotificationType } from "../services";
import { INotificationChangeStreamExecutor } from "../executor";
import { container, Types } from "../../configuration/inversify";
import { ObjectId } from "mongodb";
import { OrderType } from "../../assets/constants";

export const NotificationSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "UserProfile",
    },
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      required: true,
    },
    orderType: {
      type: String,
      enum: ["BuyOrder", "SellOrder"],
      required: true,
    },
    orderId: {
      // can use dynamic "path" in populate to populate this field so don't need ref
      type: mongoose.Types.ObjectId,
    },
    expiredAt: {
      type: Date,
      index: {
        expires: "14d",
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true, strict: true }
);

export type Notification = Document<{
  profileId: ObjectId;
  title: string;
  body: string;
  notificationType: NotificationType;
  orderType: OrderType;
  orderId: ObjectId;
  isRead: boolean;
  imageUrl?: string;
}>;

export const NotificationRepository: Repository<Notification> = mongoose.model(
  "Notification",
  NotificationSchema
);

NotificationRepository.watch().on("change", (data) => {
  const notificationChangeStreamExecutor = container.get<INotificationChangeStreamExecutor>(
    Types.NotificationChangeStreamExecutor
  );
  if (data.operationType === "insert") {
    notificationChangeStreamExecutor.executeOnNotificationInsert(data);
  }
});
