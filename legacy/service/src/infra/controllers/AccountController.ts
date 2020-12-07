// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { compare, hash } from "bcrypt";
import crypto from "crypto";
import express from "express";
import { body, query } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
  httpPatch,
  queryParam,
} from "inversify-express-utils";
import passport from "passport";
import FacebookTokenStrategy from "passport-facebook-token";
import { Strategy as GoogleTokenStrategy } from "passport-token-google";
import { GooglePassportStrategyProfile } from "../../../types";
import * as constants from "../../assets/constants";
import { Types } from "../../configuration/inversify/inversify.types";
import * as middlewares from "../middlewares";
import { IEmailService, IJwtService } from "../services";
import {
  AccessLevel,
  Repository,
  UserAccount,
  Verification,
  AccountProvider,
} from "../database";
import { IAccountDao } from "../dao";
import { AppleStrategy, EnvironmentProvider } from "../providers";

@controller("/api/v1/account")
export class AccountController {
  @inject(Types.AccountRepository)
  private readonly accountRepo!: Repository<UserAccount>;

  @inject(Types.AccountDao)
  private readonly accountDao!: IAccountDao;

  @inject(Types.VerificationRepository)
  private readonly verificationRepo!: Repository<Verification>;

  @inject(Types.EmailService)
  private readonly emailService!: IEmailService;

  @inject(Types.JwtService)
  private readonly jwtService!: IJwtService;

  public constructor() {
    if (!EnvironmentProvider.env.FbClientId || !EnvironmentProvider.env.FbClientSecret) {
      console.error("Value is not ready");
      throw new Error("Uninitialized environment variable(s)");
    } else {
      passport.serializeUser((user: UserAccount, done) => {
        done(null, user.id);
      });

      passport.deserializeUser(async (userId: string, done) => {
        try {
          const user = await this.accountDao.findById(userId);
          done(null, user);
        } catch (err) {
          done(err);
        }
      });

      // setup passport for facebook auth
      passport.use(
        new FacebookTokenStrategy(
          {
            clientID: EnvironmentProvider.env.FbClientId,
            clientSecret: EnvironmentProvider.env.FbClientSecret,
          },
          this._fbPassportCallback.bind(this)
        )
      );

      // setup passport for google auth
      passport.use(
        new GoogleTokenStrategy(
          {
            clientID: EnvironmentProvider.env.GoogleClientId,
            clientSecret: EnvironmentProvider.env.GoogleClientSecret,
          },
          this._googlePassportCallbackAsync.bind(this)
        )
      );

      // setup passport for email auth
      passport.use(
        new constants.LocalStrategy(
          {
            usernameField: "email",
          },
          this._emailPassportCallback.bind(this)
        )
      );

      // setup passport for apple auth
      passport.use(new AppleStrategy(this._applePassportCallback.bind(this)));
    }
  }

  @httpPost("/auth/facebook", passport.authenticate("facebook-token", { session: false }))
  public async facebookAuthentication(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account = req.user as UserAccount;
    const host = `${req.protocol}://${req.headers.host}`;

    if (account && req.authInfo?.provider) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ provider: req.authInfo?.provider as string });
    }

    if (!account.isVerified) {
      this._sendVerificationEmail(account, host);
    }

    const jwtToken = this.jwtService.createJWToken(account._id);
    const status = !account.isVerified ? HttpStatus.CREATED : HttpStatus.OK;

    return res.status(status).send({ account, token: jwtToken });
  }

  @httpPost("/auth/google", passport.authenticate("google-token", { session: false }))
  public async googleAuth(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account = req.user as UserAccount;
    const host = `${req.protocol}://${req.headers.host}`;

    if (account && req.authInfo?.provider) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ provider: req.authInfo?.provider as string });
    }

    if (!account.isVerified) {
      await this._sendVerificationEmail(account, host);
    }

    const jwtToken = this.jwtService.createJWToken(account.id);

    return res.status(HttpStatus.CREATED).send({ account, token: jwtToken });
  }

  @httpPost(
    "/auth/email/login",
    body("email").isEmail(),
    middlewares.ValidationPassedMiddleware,
    passport.authenticate("local")
  )
  public async emailLogin(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account = req.user;
    const host = `${req.protocol}://${req.headers.host}`;

    if (account && req.authInfo?.provider) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ provider: req.authInfo?.provider as string });
    }

    if (!account.isVerified) {
      await this._sendVerificationEmail(account, host);
    }

    const jwtToken = this.jwtService.createJWToken(account.id);

    return res.status(HttpStatus.OK).send({ account, token: jwtToken });
  }

  @httpPost(
    "/auth/email/signup",
    body("email").isEmail(),
    body("password").isString(),
    middlewares.ValidationPassedMiddleware
  )
  public async emailSignup(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const { email, password } = req.body;
    const host = `${req.protocol}://${req.headers.host}`;
    let account = await this.accountDao.findByProviderEmail(email);
    if (account) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: "This email has been registered.",
      });
    } else {
      const hashedPassword = await hash(password, constants.saltRounds);
      account = await this.accountDao.createEmailAccount(email, hashedPassword);
      this._sendVerificationEmail(account, host);
      return res.status(HttpStatus.CREATED).send({
        account,
        token: this.jwtService.createJWToken(account._id),
      });
    }
  }

  @httpPost("/auth/apple", passport.authenticate("apple-strategy", { session: false }))
  public async authenticateWithApple(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account: UserAccount = req.user;
    const jwtToken = this.jwtService.createJWToken(account.id);

    return res.status(HttpStatus.OK).send({ account, token: jwtToken });
  }

  @httpGet("/", middlewares.AuthMiddleware)
  public async getAccount(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account: UserAccount = req.user;
    return res.status(HttpStatus.OK).send({ account });
  }

  @httpGet("/logout")
  public logOut(@request() req: express.Request, @response() res: express.Response) {
    req.logOut();
    return res.status(HttpStatus.OK).send({
      message: "Log out success",
    });
  }

  @httpGet(
    "/verify",
    query("verificationToken").isString(),
    middlewares.ValidationPassedMiddleware
  )
  public async verifyAccount(
    @queryParam("verificationToken") verificationToken: string,
    @response() res: express.Response
  ) {
    let account = await this.accountDao.findByVerificationToken(verificationToken);
    if (!account) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Verification Token or Account not found",
      });
    } else if (account.isVerified) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: "Account is already verified",
      });
    } else {
      account = await this.accountDao.updateById(account._id, {
        isVerified: true,
      });
      return res.status(HttpStatus.OK).send({
        message: "Verify account successfully",
      });
    }
  }

  @httpPost(
    "/send-confirmation-token",
    body("email").isEmail(),
    middlewares.ValidationPassedMiddleware
  )
  public async sendConfirmationToken(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const email = req.body.email as string;
    const host = `${req.protocol}://${req.headers.host}`;
    const account = await this.accountDao.findByProviderEmail(email);
    if (!account) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "No account registered with this email",
      });
    } else {
      const verification = await this.accountDao.createVerification(account._id);
      this.emailService.sendVerificationEmail(account, verification, host);
      // DO NOT SEND VERIFICATION IN RESPONSE
      return res.status(HttpStatus.OK).send({
        message: "Confirmation token sent!",
      });
    }
  }

  @httpPost(
    "/verify-token",
    body("token").isString(),
    middlewares.ValidationPassedMiddleware
  )
  public async verifyToken(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const account = await this.accountDao.findByVerificationToken(req.body.token);
    if (!account) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: "Invalid token!",
      });
    } else {
      return res.status(HttpStatus.OK).send({
        message: "Valid token!",
      });
    }
  }

  @httpPatch(
    "/set-password",
    body("token").isString(),
    body("newPassword").isString(),
    middlewares.ValidationPassedMiddleware
  )
  public async setPassword(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const { token, newPassword } = req.body;
    const account = await this.accountDao.findByVerificationToken(token);
    if (!account) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: "Invalid token!",
      });
    } else {
      const hashedPassword = await hash(newPassword, constants.saltRounds);
      await this.accountDao.updateById(account._id, {
        password: hashedPassword,
      });
      return res.status(HttpStatus.OK).send({
        message: "Set password successfully",
      });
    }
  }

  @httpPatch(
    "/set-access-level",
    middlewares.AuthMiddleware,
    middlewares.AccountVerifiedMiddleware,
    middlewares.AdminPermissionMiddleware,
    body("accessLevel").isIn(Object.keys(AccessLevel)),
    body("accountId").isMongoId(),
    middlewares.ValidationPassedMiddleware
  )
  public async setAccessLevel(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const { accountId, accessLevel } = req.body;
    const account = await this.accountDao.updateById(accountId, {
      accessLevel,
    });
    if (!account) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Account not found!",
      });
    } else {
      return res.status(HttpStatus.OK).send({ account });
    }
  }

  @httpPatch(
    "/change-password",
    middlewares.AuthMiddleware,
    body("currentPassword").isString(),
    body("newPassword").isString(),
    middlewares.ValidationPassedMiddleware
  )
  public async changePassword(
    @response() res: express.Response,
    @request() req: express.Request
  ) {
    const account = req.user as UserAccount;
    const { currentPassword, newPassword } = req.body;
    const validPassword = await compare(currentPassword as string, account.password);
    if (validPassword) {
      const newHashedPassword = await hash(newPassword, constants.saltRounds);
      await this.accountDao.updateById(account._id, {
        password: newHashedPassword,
      });
      return res.status(HttpStatus.OK).send({
        message: "Update password success",
      });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: "You have entered the wrong password",
      });
    }
  }

  private async _fbPassportCallback(
    _accessToken: any,
    _refreshToken: any,
    profile: FacebookTokenStrategy.Profile,
    callback: (error: any, user?: UserAccount, info?: any) => void
  ) {
    try {
      let facebookAccount = await this.accountDao.findByProviderEmail(
        profile.emails[0].value
      );

      if (facebookAccount && facebookAccount.accountProvider !== profile.provider) {
        return callback(null, facebookAccount, {
          provider: facebookAccount.accountProvider,
        });
      } else if (facebookAccount) {
        return callback(null, facebookAccount);
      } else {
        facebookAccount = await this.accountDao.createFacebookAccount(profile);
        return callback(null, facebookAccount);
      }
    } catch (error) {
      return callback(error, null);
    }
  }

  private async _googlePassportCallbackAsync(
    _accessToken: string,
    _refreshToken: string,
    profile: GooglePassportStrategyProfile,
    callback: (error: any, user?: UserAccount, info?: any) => void
  ) {
    let googleAccount: UserAccount = await this.accountRepo.findOne({
      accountEmailByProvider: profile.emails[0].value,
    });

    if (googleAccount && googleAccount.accountProvider !== profile.provider) {
      return callback(null, googleAccount, {
        provider: googleAccount.accountProvider,
      });
    } else if (googleAccount) {
      return callback(null, googleAccount);
    } else {
      try {
        googleAccount = await this.accountRepo.create({
          accountProvider: profile.provider,
          accountEmailByProvider: profile.emails[0].value,
          accountNameByProvider: profile.name,
        });

        callback(null, googleAccount);
      } catch (error) {
        callback(error, null);
      }
    }
  }

  private async _emailPassportCallback(
    email: string,
    password: string,
    callback: (error: any, user?: UserAccount | boolean, info?: any) => void
  ) {
    try {
      const account: UserAccount = await this.accountDao.findByProviderEmail(email);

      if (account && account.accountProvider !== AccountProvider.email) {
        return callback(null, account, { provider: account.accountProvider });
      }

      if (!account) {
        return callback(null, false, { message: "Incorrect email." });
      }

      const isPasswordCorrect = await compare(password, account.password);
      if (!isPasswordCorrect) {
        return callback(null, false, { message: "Incorrect password." });
      }

      return callback(null, account);
    } catch (err) {
      return callback(err);
    }
  }

  private async _applePassportCallback(
    userId: string,
    callback: (error: any, profile: any) => void
  ) {
    try {
      let account: UserAccount = await this.accountDao.findByProviderId(userId);
      if (!account) {
        account = await this.accountDao.createAppleAccount(userId);
      }

      callback(null, account);
    } catch (error) {
      callback(error, null);
    }
  }

  private async _createVerificationToken(userAccount: UserAccount): Promise<Verification> {
    const verificationToken = crypto.randomBytes(16).toString("hex");

    const verification: Verification = await this.verificationRepo.create({
      verificationToken,
      userAccountId: userAccount._id,
    });

    return verification.save();
  }

  private async _sendVerificationEmail(account: UserAccount, host: string) {
    const verification: Verification = await this._createVerificationToken(account);
    this.emailService.sendVerificationEmail(account, verification, host);
  }
}
