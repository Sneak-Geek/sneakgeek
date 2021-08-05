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
import { AuthMiddleware, FirebaseAuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import mongoose from "mongoose";
import { IProfileDao, IAccountDao } from "../dao";
import { INotificationService } from "../services";
import { IFirebaseAuthService } from "../services/FirebaseAuthService";
import { Http } from "winston/lib/winston/transports";

@controller("/api/v1/profile")
export class ProfileController {
  @inject(Types.AccountDao)
  private readonly accountDao!: IAccountDao;

  @inject(Types.ProfileDao)
  private readonly profileDao!: IProfileDao;

  @inject(Types.NotificationService)
  private readonly notificationService!: INotificationService;

  @inject(Types.FirebaseAuthService)
  private readonly firebaseService!: IFirebaseAuthService;

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
    body("userProvidedAddress.addressLine1").optional().isString(),
    body("userProvidedAddress.addressLine2").optional().isString(),
    body("userProvidedGender").optional().isString(),
    body("userProvidedPhoneNumber").optional().isString(),
    body("userProvidedEmail").optional().isEmail(),
    body("userProvidedName.firstName").optional().isString(),
    body("userProvidedName.middleName").optional().isString(),
    body("userProvidedName.lastName").optional().isString(),
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

  @httpGet(
    "/auth/continue",
    FirebaseAuthMiddleware
  )
  public async continue(@request() req: express.Request, @response() res: express.Response) {
    const {user} = req;
    return res.status(HttpStatus.OK).send({profile: user});
  }

  @httpPost(
    "/auth/signup",
    body("token").isString(),
    ValidationPassedMiddleware
  )
  public async signup(@request() req: express.Request, @response() res: express.Response) {
    const {token} = req.body;
    try {
      const {uid} = await this.firebaseService.verifyIdToken(token);
      const profile = await this.profileDao.createUserWithFirebaseAccountId(uid);
      return res.status(HttpStatus.OK).send({profile});
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: error});
    }
  }
}
