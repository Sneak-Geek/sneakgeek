// !
// ! Copyright (c) 2020 - SneakGeek. All rights reserved
// !

import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { UserAccount, AccessLevel } from "../database";

/**
 * This middleware should be used after AuthMiddleware
 */
export const AuthenticatorPermissionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userAccessLevel = (req.user as UserAccount).accessLevel;
  if (
    userAccessLevel !== AccessLevel.Admin &&
    userAccessLevel !== AccessLevel.Authenticator
  ) {
    return res.status(HttpStatus.UNAUTHORIZED).send({
      message: "User does not have permission!",
    });
  }

  return next();
};
