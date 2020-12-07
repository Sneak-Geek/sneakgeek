import * as express from "express";
import { controller, httpGet, request, response, httpPatch } from "inversify-express-utils";
import { inject } from "inversify";
import { Types } from "../../configuration/inversify";
import { UserAccount } from "../database";
import { AuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import { body } from "express-validator";
import { ObjectId } from "mongodb";
import { INotificationDao } from "../dao";
import HttpStatus from "http-status";

@controller("/api/v1/notification")
export class NotificationController {
  @inject(Types.NotificationDao)
  private notificationDao!: INotificationDao;

  @httpPatch(
    "/read",
    AuthMiddleware,
    body("notifications").isString(),
    ValidationPassedMiddleware
  )
  public async markNotificationsAsRead(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const notifications = req.body.notifications as string;
    const profileId = (req.user as UserAccount).profile;

    await this.notificationDao.markNotificationsAsRead(
      profileId as ObjectId,
      notifications.split(",")
    );

    return res.status(HttpStatus.OK);
  }

  @httpGet("/", AuthMiddleware, ValidationPassedMiddleware)
  public async getNotification(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account = req.user as UserAccount;
    const notifications = await this.notificationDao.getNotifications(
      account.profile as ObjectId
    );

    return res.status(HttpStatus.OK).send({
      notifications,
    });
  }
}
