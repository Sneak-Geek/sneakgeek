// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import CryptoJS from "crypto-js";
import {
  INotificationService,
  INotificationBuilder,
  NotificationType,
  ApnsNotificationSchema,
  OrderNotificationContent,
} from "./INotificationService";
import { BaseExternalApiService } from "../BaseExternalApiService";
import { LogProvider } from "../../providers";
import { ObjectId } from "mongodb";
import { OrderType } from "../../../assets/constants";
import { EnvironmentProvider } from "../../providers";

export class NotificationBuilder implements INotificationBuilder {
  private title: string;
  private body: string;
  private notificationType: NotificationType;
  private orderType: OrderType;
  private order: ObjectId;

  public setTitle(title: string): NotificationBuilder {
    this.title = title;
    return this;
  }

  public setBody(body: string): NotificationBuilder {
    this.body = body;
    return this;
  }

  public setNotificationType(type: NotificationType): NotificationBuilder {
    this.notificationType = type;
    return this;
  }

  public setOrderType(type: OrderType): NotificationBuilder {
    this.orderType = type;
    return this;
  }

  public setOrderId(orderId: ObjectId): NotificationBuilder {
    this.order = orderId;
    return this;
  }

  public build(): ApnsNotificationSchema<OrderNotificationContent> {
    return {
      aps: {
        alert: {
          title: this.title,
          body: this.body,
        },
      },
      notificationType: this.notificationType,
      orderType: this.orderType,
      order: this.order,
    };
  }
}

/**
 * Refer to following links:
 * - https://docs.microsoft.com/en-us/rest/api/notificationhubs/common-concepts
 * - https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-push-notification-registration-management
 * - https://portal.azure.com/#@sneakgeek.app/resource/subscriptions/15858167-4a66-4ba0-bf25-d42ccb68b373/resourcegroups/SneakGeek/providers/Microsoft.NotificationHubs/namespaces/snkg-dev-noti-hub/notificationHubs/snkg-dev-noti-hub/accessPolicies
 */
@injectable()
export class NotificationService extends BaseExternalApiService
  implements INotificationService {
  private readonly sasKeyName = EnvironmentProvider.env.AzNotificationSasKeyName;
  private readonly sasKeyValue = EnvironmentProvider.env.AzNotificationSasKeyValue;
  private readonly azNotiHubNs = EnvironmentProvider.env.AzNotificationHubNamespace;
  private readonly azNotiHubName = EnvironmentProvider.env.AzNotificationHubName;
  private readonly azNotiHubBaseUrl = "servicebus.windows.net";
  private readonly azNotiHubApiVersion = "2015-01";
  private readonly sendNotificationCommonHeaders = {
    Authorization: this.generateSASToken(this.sendNotificationEndpoint), // use same token for every send notification requests
    "Content-Type": "application/json;charset=utf-8",
  };

  public constructor() {
    super();
  }

  private get baseNotiHubEndpoint(): string {
    return `https://${this.azNotiHubNs}.${this.azNotiHubBaseUrl}/${this.azNotiHubName}`;
  }

  private get sendNotificationEndpoint(): string {
    return `${this.baseNotiHubEndpoint}/messages?api-version=${this.azNotiHubApiVersion}`;
  }

  public get builder(): INotificationBuilder {
    return new NotificationBuilder();
  }

  public async registerDevice(
    userProfileId: string,
    installationId: string,
    platform: string,
    pushChannel: string
  ): Promise<any> {
    const registerDeviceEndpoint = `${this.baseNotiHubEndpoint}/installations/${installationId}?api-version=${this.azNotiHubApiVersion}`;
    const sasToken = this.generateSASToken(registerDeviceEndpoint);
    try {
      return await this.apiClient.put(
        registerDeviceEndpoint,
        {
          installationId,
          platform,
          pushChannel,
          tags: [userProfileId],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: sasToken,
            "x-ms-version": "2015-01",
          },
        }
      );
    } catch (error) {
      LogProvider.instance.error(
        `Error registering with notification hub:\n${JSON.stringify(error.stack, null, 2)}`
      );
      throw error;
    }
  }

  public async sendNotification<T>(
    tag: string,
    body: ApnsNotificationSchema<T>
  ): Promise<any> {
    try {
      const response = await this.apiClient.post(this.sendNotificationEndpoint, body, {
        headers: {
          ...this.sendNotificationCommonHeaders,
          "ServiceBusNotification-Tags": tag,
          "ServiceBusNotification-Format": "apple",
        },
      });
      LogProvider.instance.debug(
        "Notification response",
        JSON.stringify(response.data, null, 2)
      );
    } catch (error) {
      LogProvider.instance.error("Error sending notification", error.name, error.stack);
      throw error;
    }
  }

  private generateSASToken(uri: string) {
    const targetUri = encodeURIComponent(uri.toLowerCase()).toLowerCase();

    // Set token expiration
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 20);
    const expires =
      Date.UTC(
        expirationDate.getUTCFullYear(),
        expirationDate.getUTCMonth(),
        expirationDate.getUTCDate(),
        expirationDate.getUTCHours(),
        expirationDate.getUTCMinutes(),
        expirationDate.getUTCSeconds()
      ) / 1000;
    const tosign = targetUri + "\n" + expires;

    // using CryptoJS
    const signature = CryptoJS.HmacSHA256(tosign, this.sasKeyValue);
    const base64signature = signature.toString(CryptoJS.enc.Base64);
    const base64UriEncoded = encodeURIComponent(base64signature);

    // construct token
    return (
      "SharedAccessSignature sr=" +
      targetUri +
      "&sig=" +
      base64UriEncoded +
      "&se=" +
      expires +
      "&skn=" +
      this.sasKeyName
    );
  }
}
