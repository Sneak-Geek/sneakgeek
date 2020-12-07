// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import * as express from "express";
import { body } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPut,
  request,
  response,
  httpPost,
} from "inversify-express-utils";
import * as Settings from "../../assets/settings";
import { UserAccount } from "../database";
import { Types } from "../../configuration/inversify/inversify.types";
import { AuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import mongoose from "mongoose";
import { NotificationPlatform } from "../../assets/constants";
import { IProfileDao, IAccountDao } from "../dao";
import { ObjectId } from "mongodb";
import { INotificationService } from "../services";

@controller("/api/v1/profile")
export class ProfileController {
  @inject(Types.AccountDao)
  private readonly accountDao!: IAccountDao;

  @inject(Types.ProfileDao)
  private readonly profileDao!: IProfileDao;

  @inject(Types.NotificationService)
  private readonly notificationService!: INotificationService;

  @httpGet("/", AuthMiddleware)
  public async getProfile(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account = req.user as UserAccount;
    let profile = await this.profileDao.findByAccountId(account._id);
    if (!profile) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        profile = await this.profileDao.createByUserAccount(account);
        // Save profile ID to account
        await this.accountDao.updateById(account._id, { profile: profile._id });
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }
    return res.status(HttpStatus.OK).send({ profile });
  }

  @httpPut(
    "/update",
    AuthMiddleware,
    body("favoriteShoeBrand").optional().isString().isIn(Settings.ShoeBrand),
    body("shoeSizeStandard").optional().isString().isIn(Settings.ShoeSizeStandard),
    body("userProvidedAddress.streetAddress").optional().isString(),
    body("userProvidedAddress.ward").optional().isString(),
    body("userProvidedAddress.wardCode").optional().isString(),
    body("userProvidedAddress.districtId").optional().isInt(),
    body("userProvidedAddress.district").optional().isString(),
    body("userProvidedAddress.city").optional().isString(),
    body("userProvidedGender").optional().isString(),
    body("userProvidedPhoneNumber")
      .optional()
      .isMobilePhone("vi-VN", { strictMode: false }),
    body("userProvidedShoeSize")
      .optional()
      .isString()
      .isIn(
        Settings.ShoeSize.Adult.concat(Settings.ShoeSize.Kid.GradeSchool)
          .concat(Settings.ShoeSize.Kid.PreSchool)
          .concat(Settings.ShoeSize.Kid.Toddler)
      ),
    body("userProvidedEmail").optional().isEmail(),
    body("userProvidedName.firstName").optional().isString(),
    body("userProvidedName.middleName").optional().isString(),
    body("userProvidedName.lastName").optional().isString(),
    body("userProvidedProfilePic").optional().isString(),
    ValidationPassedMiddleware
  )
  public async updateProfileInfo(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const profile = await this.profileDao.updateById(req.user.profile, req.body);
    if (!profile) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Profile not found",
      });
    } else {
      return res.status(HttpStatus.OK).send({ profile });
    }
  }

  @httpPost(
    "/notification/register",
    AuthMiddleware,
    body("platform").isIn(Object.keys(NotificationPlatform)),
    body("pushChannel").isString(),
    ValidationPassedMiddleware
  )
  public async registerDeviceForPushNotification(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const profileId: string = (req.user.profile as ObjectId).toHexString();
    const installationId = profileId + req.body.pushChannel;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const profile = await this.profileDao.registerDeviceForPushNotification(
        profileId,
        installationId,
        req.body.platform,
        req.body.pushChannel
      );

      if (!profile) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: "Cannot find user profile, or profile already registered",
        });
      } else {
        await this.notificationService.registerDevice(
          profileId,
          installationId,
          req.body.platform,
          req.body.pushChannel
        );
        await session.commitTransaction();
        return res.status(HttpStatus.CREATED).send({ profile });
      }
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
