import { NextFunction, Request, Response } from "express";
import Server from "../../Server";
import { Types } from "../../configuration/inversify/inversify.types";
import { IFirebaseAuthService } from "../services/FirebaseAuthService";
import HttpStatus from "http-status";
import { IProfileDao } from "../dao";
import { LogProvider } from "../providers";

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
    if (!decodedToken || !decodedToken.uid) {
      console.log("Error in Firebase Authentication Invalid Token");
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: "Invalid token",
      });
    }
    console.log("Find user with firebase account id");
    let user = await profileDao.findByFirebaseAccountId(decodedToken?.uid);

    if (!user) {
      console.log("Create user with firebase account id");
      user = await profileDao.createUserWithFirebaseAccountId({
        firebaseAccountId: decodedToken?.uid,
        userProvidedEmail: decodedToken?.email,
      });
    }
    console.log("Got user with firebase account id");
    req.user = user;
  } catch (error) {
    console.log("Error in Firebase Authentication: ", error);
    LogProvider.instance.error(error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      message: "Internal server errror",
    });
  }

  return next();
};
