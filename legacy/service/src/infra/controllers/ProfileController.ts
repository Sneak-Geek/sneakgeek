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
import { UserAccount } from "../database";
import { Types } from "../../configuration/inversify/inversify.types";
import { AuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import mongoose from "mongoose";
import { IProfileDao, IAccountDao } from "../dao";
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
    body("userProvidedEmail").optional().isEmail(),
    body("userProvidedName.firstName").optional().isString(),
    body("userProvidedName.middleName").optional().isString(),
    body("userProvidedName.lastName").optional().isString(),
    body("userProvidedProfilePic").optional().isString(),
    body("isSeller").optional().isBoolean(),
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
}
