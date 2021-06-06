//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { suite, params, test } from "@testdeck/jest";
import Server from "../../../src/Server";
import request from "supertest";
import { Endpoints } from "../config";
import HttpStatus from "http-status";
import { emailSignup, destroyAccountByEmail } from "./utils";
import { isEqual } from "lodash";
import { NotificationPlatform } from "../../../src/assets/constants";
import { INotificationService } from "../../../src/infra/services";
import { Types } from "../../../src/configuration/inversify";
import sinon from "sinon";

@suite("/api/v1/profile")
export class ProfileControllerTest {
  private static readonly userCredential = {
    email: "user@gmail.com",
    password: "password",
  };
  private static userToken: string;
  private static userProfileId: string;

  public static async before() {
    await Server.initAppAsync();
    this.userToken = (await emailSignup(this.userCredential)).token;
    this.userProfileId = (
      await request(Server.instance)
        .get(Endpoints.Profile.Index)
        .set("authorization", ProfileControllerTest.userToken)
    ).body.profile._id;

    // stub register device to avoid spamming notification hub installation
    const notificationService = Server.container.get<INotificationService>(
      Types.NotificationService
    );
    sinon.stub(notificationService, "registerDevice").resolves();
  }

  public static async after() {
    await destroyAccountByEmail(ProfileControllerTest.userCredential.email);
    Server.exit();
  }

  @test("GET /: get profile using valid token")
  public async getProfileUsingValidToken() {
    const res = await request(Server.instance)
      .get(Endpoints.Profile.Index)
      .set("authorization", ProfileControllerTest.userToken);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.profile).not.toBeUndefined();
    expect(res.body.profile).not.toBeNull();
  }

  @test("GET /: get profile using invalid token")
  public async getProfileUsingInvalidToken() {
    const token = "InvalidToken";
    const res = await request(Server.instance)
      .get(Endpoints.Profile.Index)
      .set("authorization", token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("PUT /update: update profile")
  @params({ update: { favoriteShoeBrand: "Nike" } })
  @params({ update: { shoeSizeStandard: "UK" } })
  @params({
    update: {
      userProvidedAddress: {
        streetAddress: "12 Thợ Nhuộm",
        ward: "Phường X",
        wardCode: "123",
        districtId: 123,
        district: "Quận Hoàn Kiếm",
        city: "Hà Nội",
      },
    },
  })
  @params({ update: { userProvidedGender: "women" } })
  @params({ update: { userProvidedPhoneNumber: "0906033432" } })
  @params({ update: { userProvidedShoeSize: "8" } })
  @params({ update: { userProvidedEmail: "new@gmail.com" } })
  @params({
    update: {
      userProvidedName: {
        firstName: "Huấn",
        middleName: "Xuân",
        lastName: "Bùi",
      },
    },
  })
  @params({ update: { userProvidedProfilePic: "https://google.com" } })
  @params.naming(({ update }) => {
    const updateField = Object.keys(update)[0];
    const updateValue = update[updateField];
    return `update ${updateField} to ${
      typeof updateValue === "object" ? JSON.stringify(updateValue) : updateValue
    }`;
  })
  public async updateProfileInfo({ update }) {
    const res = await request(Server.instance)
      .put(Endpoints.Profile.UpdateProfileInfo)
      .send({ ...update })
      .set("authorization", ProfileControllerTest.userToken);

    const updateField = Object.keys(update)[0];
    const updateValue = update[updateField];
    const updatedProfile = res.body.profile;

    if (typeof updatedProfile[updateField] === "object") {
      delete updatedProfile[updateField]._id;
    }

    expect(res.status).toEqual(HttpStatus.OK);
    expect(isEqual(updatedProfile[updateField], updateValue)).toEqual(true);
  }

  @test("POST /notification/register: register push notification")
  public async registerNotification() {
    const platform = NotificationPlatform.APNS;
    const pushChannel = "pushChannel";
    const res = await request(Server.instance)
      .post(Endpoints.Profile.RegisterNotification)
      .send({ platform, pushChannel })
      .set("authorization", ProfileControllerTest.userToken);

    // there should be only 1 registered device
    const newRegisteredDevice = res.body.profile.notificationSetting.registeredDevices[0];
    expect(res.status).toEqual(HttpStatus.CREATED);
    expect(newRegisteredDevice.installationId).toEqual(
      ProfileControllerTest.userProfileId + pushChannel
    );
    expect(newRegisteredDevice.platform).toEqual(platform);
    expect(newRegisteredDevice.pushChannel).toEqual(pushChannel);
  }

  @test("POST /notification/register: register same device twice")
  public async registerNotificationDuplicatedDevice() {
    const platform = NotificationPlatform.APNS;
    const pushChannel = "duplicatedPushChannel";
    await request(Server.instance)
      .post(Endpoints.Profile.RegisterNotification)
      .send({ platform, pushChannel })
      .set("authorization", ProfileControllerTest.userToken);
    const res = await request(Server.instance)
      .post(Endpoints.Profile.RegisterNotification)
      .send({ platform, pushChannel })
      .set("authorization", ProfileControllerTest.userToken);

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  }
}
