//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { suite, test } from "@testdeck/jest";
import Server from "../../../src/Server";
import request from "supertest";
import HttpStatus from "http-status";
import { Endpoints, FacebookTestUser, User1, Admin } from "../config";
import { IAccountDao } from "../../../src/infra/dao";
import { Types } from "../../../src/configuration/inversify";
import mongoose from "mongoose";
import { emailLogin, emailSignup, destroyAccountByEmail } from "./utils";
import { compare } from "bcrypt";
import { AccessLevel, UserAccount } from "../../../src/infra/database";
import { NotificationServiceMock, NotificationChangeStreamExecutorMock } from "../mocks";

@suite("/api/v1/account")
export class AccountControllerTest {
  private static user1Token: string;
  private static adminToken: string;
  private static accountDao: IAccountDao;

  private accountCredential = {
    email: "email@abc.com",
    password: "password",
  };

  private account: UserAccount;
  private token: string;

  public static async before() {
    Server.container.snapshot();
    Server.container.unbind(Types.NotificationChangeStreamExecutor);
    Server.container.unbind(Types.NotificationService);

    Server.container
      .bind(Types.NotificationChangeStreamExecutor)
      .to(NotificationChangeStreamExecutorMock)
      .inSingletonScope();
    Server.container.bind(Types.NotificationService).to(NotificationServiceMock);

    await Server.initAppAsync();
    this.user1Token = (await emailLogin(User1.Credential)).token;
    this.adminToken = (await emailLogin(Admin.Credential)).token;
    this.accountDao = Server.container.get<IAccountDao>(Types.AccountDao);
  }

  public static async after() {
    Server.container.restore();

    await destroyAccountByEmail(FacebookTestUser.Account.accountEmailByProvider);
    Server.exit();
  }

  public async before() {
    const body = await emailSignup(this.accountCredential);
    this.account = body.account;
    this.token = body.token;
  }

  public async after() {
    await destroyAccountByEmail(this.accountCredential.email);
  }

  @test("POST /auth/facebook: facebook authentication")
  public async facebookAuthentication() {
    const res = await request(Server.instance)
      .post(Endpoints.Account.FacebookAuth)
      .set("access_token", FacebookTestUser.Token);

    const { token, account } = res.body;
    const { familyName, givenName, middleName } = account.accountNameByProvider;
    expect(res.status).toEqual(HttpStatus.CREATED);
    expect(token).not.toBeUndefined();
    expect(token).not.toBeNull();
    expect(account.isVerified).toEqual(FacebookTestUser.Account.isVerified);
    expect(account.accountProvider).toEqual(FacebookTestUser.Account.accountProvider);
    expect(account.accountEmailByProvider).toEqual(
      FacebookTestUser.Account.accountEmailByProvider
    );
    expect(familyName).toEqual(FacebookTestUser.Account.accountNameByProvider.familyName);
    expect(givenName).toEqual(FacebookTestUser.Account.accountNameByProvider.givenName);
    expect(middleName).toEqual(FacebookTestUser.Account.accountNameByProvider.middleName);
  }

  @test("POST /auth/facebook: facebook authentication using invalid token")
  public async facebookAuthenticationInvalidToken() {
    const token = "InvalidToken";
    const res = await request(Server.instance)
      .post(Endpoints.Account.FacebookAuth)
      .set("access_token", token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("POST /auth/email/login: email login")
  public async emailLogin() {
    const res = await request(Server.instance)
      .post(Endpoints.Account.EmailLogin)
      .send(User1.Credential);

    const { account, token } = res.body;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(token).not.toBeUndefined();
    expect(token).not.toBeNull();
    expect(account._id).toEqual(User1.Account._id);
    expect(account.accountProvider).toEqual(User1.Account.accountProvider);
    expect(account.accountIdByProvider).toEqual(User1.Account.accountIdByProvider);
    expect(account.accountEmailByProvider).toEqual(User1.Account.accountEmailByProvider);
    expect(account.profile).toEqual(User1.Account.profile);
    expect(account.accessLevel).toEqual(User1.Account.accessLevel);
  }

  @test("POST /auth/email/login: email login using invalid credential")
  public async emailLoginInvalidCredential() {
    const email = "random@abc.com";
    const password = "password";
    const res = await request(Server.instance)
      .post(Endpoints.Account.EmailLogin)
      .send({ email, password });

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("POST /auth/email/signup: email signup")
  public async emailSignup() {
    const email = "email@gmail.com";
    const password = "password";
    const res = await request(Server.instance)
      .post(Endpoints.Account.EmailSignup)
      .send({ email, password });

    const { account, token } = res.body;
    expect(res.status).toEqual(HttpStatus.CREATED);
    expect(token).not.toBeUndefined();
    expect(token).not.toBeNull();
    expect(account.accessLevel).toEqual("User");
    expect(account.accountEmailByProvider).toEqual(email);
    expect(account.accountIdByProvider).toEqual(email);
    expect(account.isVerified).toEqual(false);
    expect(account.accountProvider).toEqual("email");
    expect(account.password).toBeUndefined();

    await destroyAccountByEmail(email);
  }

  @test("GET /: get user account")
  public async getAccount() {
    const res = await request(Server.instance)
      .get(Endpoints.Account.Index)
      .set("authorization", AccountControllerTest.user1Token);

    const { account } = res.body;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(account.accountProvider).toEqual(User1.Account.accountProvider);
    expect(account.accountIdByProvider).toEqual(User1.Account.accountIdByProvider);
    expect(account.accountEmailByProvider).toEqual(User1.Account.accountEmailByProvider);
    expect(account.profile).toEqual(User1.Account.profile);
    expect(account.accessLevel).toEqual(User1.Account.accessLevel);
  }

  @test("GET /: get user account using invalid token")
  public async getAccountInvalidToken() {
    const token = "InvalidToken";
    const res = await request(Server.instance)
      .get(Endpoints.Account.Index)
      .set("authorization", token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("GET /verify: verify unverified account")
  public async verifyAccount() {
    const { verificationToken } = await AccountControllerTest._createVerification(
      this.account._id
    );

    const res = await request(Server.instance)
      .get(Endpoints.Account.VerifyAccount)
      .query({ verificationToken });

    const verifiedAccount = (await emailLogin(this.accountCredential)).account;
    expect(res.status).toEqual(HttpStatus.OK);
    expect(verifiedAccount.isVerified).toEqual(true);
  }

  @test("GET /verify: verify already verified account")
  public async verifyVerifiedAccount() {
    const { verificationToken } = await AccountControllerTest._createVerification(
      User1.Account._id
    );
    const res = await request(Server.instance)
      .get(Endpoints.Account.VerifyAccount)
      .query({ verificationToken });

    expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
  }

  @test("POST /send-confirmation-token: send confirmation token")
  public async sendConfirmationToken() {
    const email = User1.Credential.email;
    const res = await request(Server.instance)
      .post(Endpoints.Account.SendConfirmationToken)
      .send({ email });

    expect(res.status).toEqual(HttpStatus.OK);
  }

  @test("POST /send-confirmation-token: send confirmation token to unregistered email")
  public async sendConfirmationTokenUnregisteredEmail() {
    const email = "randomemail@abc.com";
    const res = await request(Server.instance)
      .post(Endpoints.Account.SendConfirmationToken)
      .send({ email });

    expect(res.status).toEqual(HttpStatus.NOT_FOUND);
  }

  @test("POST /verify-token: verify token")
  public async verifyToken() {
    const { verificationToken } = await AccountControllerTest._createVerification(
      User1.Account._id
    );
    const res = await request(Server.instance)
      .post(Endpoints.Account.VerifyToken)
      .send({ token: verificationToken });

    expect(res.status).toEqual(HttpStatus.OK);
  }

  @test("POST /verify-token: verify invalid token")
  public async verifyInvalidToken() {
    const token = "InvalidToken";
    const res = await request(Server.instance)
      .post(Endpoints.Account.VerifyToken)
      .send({ token });

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("PATCH /set-password: set account password")
  public async setPassword() {
    const { verificationToken } = await AccountControllerTest._createVerification(
      this.account._id
    );
    const newPassword = "newPassword";

    const res = await request(Server.instance)
      .patch(Endpoints.Account.SetPassword)
      .send({ token: verificationToken, newPassword });

    const updatedAccount = await AccountControllerTest.accountDao.findByProviderEmail(
      this.accountCredential.email
    );
    const passwordMatch = await compare(newPassword, updatedAccount.password);
    expect(res.status).toEqual(HttpStatus.OK);
    expect(passwordMatch).toEqual(true);
  }

  @test("PATCH /set-password: set account password using invalid token")
  public async setPasswordInvalidToken() {
    const token = "InvalidToken";
    const newPassword = "newPassword";

    const res = await request(Server.instance)
      .patch(Endpoints.Account.SetPassword)
      .send({ token, newPassword });

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("PATCH /set-access-level: set account access level")
  public async setAccessLevel() {
    const newAccessLevel = AccessLevel.Partner;
    const res = await request(Server.instance)
      .patch(Endpoints.Account.SetAccessLevel)
      .send({ accessLevel: newAccessLevel, accountId: this.account._id })
      .set("authorization", AccountControllerTest.adminToken);

    expect(res.status).toEqual(HttpStatus.OK);
    expect(res.body.account.accessLevel).toEqual(newAccessLevel);
  }

  @test("PATCH /set-access-level: set access level using User permission")
  public async setAccessLevelUserPermission() {
    const newAccessLevel = AccessLevel.Partner;
    const res = await request(Server.instance)
      .patch(Endpoints.Account.SetAccessLevel)
      .send({
        accessLevel: newAccessLevel,
        accountId: new mongoose.Types.ObjectId(),
      })
      .set("authorization", AccountControllerTest.user1Token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  @test("PATCH /change-password: change account password")
  public async changePassword() {
    const newPassword = "newPassword";
    const res = await request(Server.instance)
      .patch(Endpoints.Account.ChangePassword)
      .send({ currentPassword: this.accountCredential.password, newPassword })
      .set("authorization", this.token);

    const updatedAccount = await AccountControllerTest.accountDao.findByProviderEmail(
      this.accountCredential.email
    );
    const passwordMatch = await compare(newPassword, updatedAccount.password);
    expect(res.status).toEqual(HttpStatus.OK);
    expect(passwordMatch).toEqual(true);
  }

  @test("PATCH /change-password: change password using invalid token")
  public async changePasswordInvalidToken() {
    const currentPassword = "currentPassword";
    const newPassword = "newPassword";
    const token = "InvalidToken";

    const res = await request(Server.instance)
      .patch(Endpoints.Account.ChangePassword)
      .send({ currentPassword, newPassword })
      .set("authorization", token);

    expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
  }

  private static async _createVerification(accountId: string) {
    return AccountControllerTest.accountDao.createVerification(accountId);
  }
}
