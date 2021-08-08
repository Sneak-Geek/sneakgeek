// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { UserAccount } from "../database";

/**
 * This middleware should be used after FirebaseAuthMiddleware
 */
export const AccountVerifiedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserAccount;
  if (!user.isVerified) {
    return res.status(HttpStatus.FORBIDDEN).send({
      message: "Forbidden. Account is not verified",
    });
  }

  return next();
};
