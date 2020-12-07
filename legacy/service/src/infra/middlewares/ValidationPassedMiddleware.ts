//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Request, NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import HttpStatus from "http-status";
import { LogProvider } from "../providers";

export const ValidationPassedMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    LogProvider.instance.debug(
      "Middleware validation error",
      JSON.stringify(error, null, 2)
    );

    return res.status(HttpStatus.BAD_REQUEST).send({
      message: "HTTP request validation error",
      error,
    });
  }

  return next();
};
