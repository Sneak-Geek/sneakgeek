// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import * as Constants from "../../assets/constants";
import { Types } from "../../configuration/inversify/inversify.types";
import Server from "../../Server";
import { IJwtService } from "../services";
import { Repository, UserAccount } from "../database";
import { JwtPayload } from "../../../types";

export const FirebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtService = Server.container.get<IJwtService>(Types.JwtService);
  const accountRepo = Server.container.get<Repository<UserAccount>>(
    Types.AccountRepository
  );

  const token = req.headers.authorization;
  if (!token) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: "Missing access token",
    });
  }

  let accountIdPayload: JwtPayload;
  try {
    accountIdPayload = await jwtService.verifyJWToken<JwtPayload>(token);
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).send({
      message: "Invalid token",
    });
  }

  req.headers[Constants.Headers.AccountId] = accountIdPayload.accountId;
  const user: UserAccount = await accountRepo.findById(accountIdPayload.accountId).exec();

  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).send({
      message: "Account not found",
    });
  }

  req.user = user;
  return next();
};
