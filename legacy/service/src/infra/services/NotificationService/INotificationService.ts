// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import { OrderType } from "../../../assets/constants";

export enum NotificationType {
  SELL_ORDER_SUCCESS = "SELL_ORDER_SUCCESS",
  SELL_ORDER_PRICE_UPDATE = "BUY_ORDER_MATCHED",
}

export type ApnsNotificationSchema<TContent> = {
  aps: {
    alert: {
      title: string;
      body: string;
    };
  };
} & TContent;

export type OrderNotificationContent = {
  notificationType: NotificationType;
  orderType: OrderType;
  order: ObjectId;
};

export interface INotificationBuilder {
  setTitle(title: string): INotificationBuilder;
  setBody(body: string): INotificationBuilder;
  setNotificationType(type: string): INotificationBuilder;
  setOrderId(orderId: ObjectId): INotificationBuilder;
  setOrderType(string: OrderType): INotificationBuilder;
  build<T>(): ApnsNotificationSchema<T>;
}

export interface INotificationService {
  /**
   * Register a user's device to receive notification.
   *
   * @param {string} userProfileId User's profile id.
   * @param {string} installationId Globally unique id for each device registered for push notification.
   * @param {string} platform Device platform (should be either APNS or GCM).
   * @param {string} pushChannel Push notification system handler.
   */
  registerDevice(
    userProfileId: string,
    installationId: string,
    platform: string,
    pushChannel: string
  ): Promise<any>;

  sendNotification<T>(tag: string, body: ApnsNotificationSchema<T>): Promise<any>;
  builder: INotificationBuilder;
}
@injectable()
export class EmptyNotificationService implements INotificationService {
  registerDevice(userProfileId: string, installationId: string, platform: string, pushChannel: string): Promise<any> {
    return Promise.resolve();
  }

  sendNotification<T>(tag: string, body: ApnsNotificationSchema<T>): Promise<any> {
    return Promise.resolve();
  }

  builder: INotificationBuilder;
}
