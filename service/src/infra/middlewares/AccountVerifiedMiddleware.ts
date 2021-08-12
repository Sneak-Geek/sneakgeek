// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import Server from "../../Server";
import { IFirebaseAuthService } from "../services/FirebaseAuthService";
import { Types } from "../../configuration/inversify/inversify.types";
import { LogProvider } from "../providers";

/**
 * This middleware should be used after FirebaseAuthMiddleware
 */
export const AccountVerifiedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firebase = Server.container.get<IFirebaseAuthService>(Types.FirebaseAuthService);
  const idToken = req?.headers?.authorization;

  try {
    const decodedToken = await firebase.verifyIdToken(idToken);
    if (!decodedToken?.email_verified && decodedToken?.email) {
      return res.status(HttpStatus.FORBIDDEN).send({
        message: "Forbidden. Account is not verified",
      });
    }
  } catch (error) {
    LogProvider.instance.error(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Internal server errror",
    });
  }

  return next();
};
