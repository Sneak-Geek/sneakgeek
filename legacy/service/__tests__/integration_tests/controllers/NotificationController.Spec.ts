//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { suite, test } from "@testdeck/jest";
import Server from "../../../src/Server";
import { User1, Endpoints } from "../config";
import { emailLogin, sleep } from "./utils";
import { DbClient, UserAccount } from "../../../src/infra/database";
import { Types } from "../../../src/configuration/inversify";
import request from "supertest";
import HttpStatus from "http-status";
import { INotificationDao } from "../../../src/infra/dao";
import { INotificationChangeStreamExecutor } from "../../../src/infra/executor";
import { ObjectId } from "mongodb";
import sinon from "sinon";
import { NotificationServiceMock } from "../mocks";

@suite("/api/v1/notification")
export class NotificationControllerTest {
  private static user1: UserAccount;
  private static user1Token: string;

  public static async before() {
    Server.container.snapshot();
    Server.container.unbind(Types.NotificationService);

    Server.container
      .bind(Types.NotificationService)
      .to(NotificationServiceMock)
      .inSingletonScope();

    await Server.initAppAsync();
    const emailLoginBody = await emailLogin(User1.Credential);

    this.user1 = emailLoginBody.account;
    this.user1Token = emailLoginBody.token;
  }

  public static after() {
    Server.container.restore();
    Server.exit();
  }

  public async after() {
    try {
      sinon.verifyAndRestore();
      const dbClient = Server.container.get<DbClient>(Types.DbClient);
      await dbClient.connection.db.dropCollection("notifications");
    } catch (error) {
      // Skip error
    }
  }

  @test("Notification stream executor should be called when new notification is created")
  public async testCreateNotificationChangeStream() {
    const notificationDao = Server.container.get<INotificationDao>(Types.NotificationDao);

    // Checking change stream executor
    const notificationChangeStreamExecutor = Server.container.get<
      INotificationChangeStreamExecutor
    >(Types.NotificationChangeStreamExecutor);
    const excuteOnInsertStub = sinon
      .stub(notificationChangeStreamExecutor, "executeOnNotificationInsert")
      .resolves();

    await notificationDao.createNotification({
      profileId: NotificationControllerTest.user1.profile as ObjectId,
      title: "Test title",
      body: "test body",
      notificationType: "test type",
      orderType: "BuyOrder",
      orderId: new ObjectId(),
      imageUrl: "",
    });

    await sleep(500);

    expect(excuteOnInsertStub.called).toBeTruthy();
  }

  @test("GET /: get notifications without seeds")
  public async getNotificationNoSeed() {
    const res = await request(Server.instance)
      .get(Endpoints.Notification.GetByProfileId)
      .set("authorization", NotificationControllerTest.user1Token);

    const notifications: Notification[] = res.body.notifications;

    expect(res.status).toEqual(HttpStatus.OK);
    expect(notifications).toBeDefined();
    expect(notifications.length).toEqual(0);
  }
}
