import { NextFunction, Request, Response } from "express";
import Server from "../../Server";
import { Types } from "../../configuration/inversify/inversify.types";
import { IFirebaseAuthService } from "../services/FirebaseAuthService";
import HttpStatus from "http-status";
import { IProfileDao } from "../dao";

export const FirebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const firebase = Server.container.get<IFirebaseAuthService>(Types.FirebaseAuthService);
  const idToken = req?.headers?.authorization;
  const profileDao = Server.container.get<IProfileDao>(Types.ProfileDao);

  if (!idToken) {
    return res.status(HttpStatus.BAD_REQUEST).send({
      message: "Missing access token",
    });
  }

  try {
    const decodedToken = await firebase.verifyIdToken(idToken);
    if (!decodedToken || decodedToken.uid) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: "Invalid token",
      });
    }
    const user = await profileDao.findByFirebaseAccountId(decodedToken?.uid);

    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Account not found",
      });
    }

    req.user = { ...user, ...decodedToken };
  } catch (error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Internal server errror.",
    });
  }

  return next();
};