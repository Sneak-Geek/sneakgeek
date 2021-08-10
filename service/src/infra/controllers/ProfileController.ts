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
} from "inversify-express-utils";
import { UserAccount } from "../database";
import { Types } from "../../configuration/inversify/inversify.types";
import { FirebaseAuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import { IProfileDao } from "../dao";
import { IFirebaseAuthService } from "../services/FirebaseAuthService";

@controller("/api/v1/profile")
export class ProfileController {
  @inject(Types.ProfileDao)
  private readonly profileDao!: IProfileDao;
  
  @inject(Types.FirebaseAuthService)
  private readonly firebaseAuthService!: IFirebaseAuthService;

  @httpGet("/", FirebaseAuthMiddleware)
  public async getProfile(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const profile = req.user as UserAccount;
    return res.status(HttpStatus.OK).send({ profile });
  }

  @httpPut(
    "/update",
    FirebaseAuthMiddleware,
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
    console.log(req.user);
    const profile = await this.profileDao.updateById(req.user._id, req.body);
    if (!profile) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Profile not found",
      });
    } else {
      return res.status(HttpStatus.OK).send({ profile });
    }
  }

  @httpGet("/auth/continue", FirebaseAuthMiddleware, ValidationPassedMiddleware)
  public async continue(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const { user } = req;
    return res.status(HttpStatus.OK).send({ profile: user });
  }

  @httpGet("/auth/delete-test-user")
  public async deleteTestUser(@response() res: express.Response) {
    await this.firebaseAuthService.deleteTestUser();
    return res.status(HttpStatus.OK);
  }
}
