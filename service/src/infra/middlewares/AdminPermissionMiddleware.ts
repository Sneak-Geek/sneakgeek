// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { UserAccount, AccessLevel } from "../database";

/**
 * This middleware should be used after FirebaseAuthMiddleware
 */
export const AdminPermissionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if ((req.user as UserAccount).accessLevel !== AccessLevel.Admin) {
    return res.status(HttpStatus.UNAUTHORIZED).send({
      message: "User does not have admin permission",
    });
  }

  return next();
};
