// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { AccessLevel, UserAccount } from "../database";

export const AdminVerifiedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as UserAccount;
  if (user.accessLevel !== AccessLevel.Admin) {
    return res.status(HttpStatus.FORBIDDEN).send({
      message: "Forbidden. Account does not have required permission.",
    });
  }

  return next();
};
