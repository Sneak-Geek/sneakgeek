//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import HttpStatus from "http-status";
import Server from "../../../../src/Server";
import sinon from "sinon";
import { BootstrapProvider } from "../../../../src/infra/providers";
import { Repository, UserAccount } from "../../../../src/infra/database";
import { Types } from "../../../../src/configuration/inversify";
import faker from "faker";
import { EmailService } from "../../../../src/infra/services";
import { Query } from "mongoose";

const url = "/api/v1/account/send-confirmation-token";

describe(url, () => {
  let res: request.Response;
  let sendMailStub: sinon.SinonStub;
  const container = Server.container;

  beforeAll(async () => {
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    await Server.initAppAsync();
  });

  afterAll(() => {
    Server.exit();
  });

  describe("POST /send-confirmation-token: Send confirmation token to existing account", () => {
    beforeAll(async () => {
      container.snapshot();

      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);

      let userRepoFindOneStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findOne").returns(userRepoFindOneStub);
      sinon.stub(userRepoFindOneStub, "exec").returns(Promise.resolve({} as UserAccount));
      sendMailStub = sinon
        .stub(EmailService.prototype, "sendVerificationEmail")
        .returns(null);

      res = await request(Server.instance)
        .post(url)
        .send({ email: faker.internet.email() });
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });

    it("Send verification email should be called once", () => {
      expect(sendMailStub.calledOnce).toBeTruthy();
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });
  });

  describe("POST /send-confirmation-token: Send confirmation token without email", () => {
    beforeAll(async () => {
      container.snapshot();
      sendMailStub = sinon
        .stub(EmailService.prototype, "sendVerificationEmail")
        .returns(null);
      res = await request(Server.instance).post(url);
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("Send verification email should not be called", () => {
      expect(sendMailStub.notCalled).toBeTruthy();
    });
  });

  describe("POST /send-confirmation-token: Send confirmation token with empty email", () => {
    beforeAll(async () => {
      container.snapshot();
      sendMailStub = sinon
        .stub(EmailService.prototype, "sendVerificationEmail")
        .returns(null);
      res = await request(Server.instance).post(url).send({ email: "" });
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("Send verification email should not be called", () => {
      expect(sendMailStub.notCalled).toBeTruthy();
    });
  });

  describe("POST /send-confirmation-token: Send confirmation token to non-existing user", () => {
    beforeAll(async () => {
      container.snapshot();

      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);

      let userRepoFindOneStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findOne").returns(userRepoFindOneStub);
      sinon.stub(userRepoFindOneStub, "exec").returns(Promise.resolve(undefined));
      sendMailStub = sinon
        .stub(EmailService.prototype, "sendVerificationEmail")
        .returns(null);

      res = await request(Server.instance)
        .post(url)
        .send({ email: faker.internet.email() });
    });

    it(`Response status should be NOT_FOUND (${HttpStatus.NOT_FOUND})`, () => {
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("Send verification email should not be called", () => {
      expect(sendMailStub.notCalled).toBeTruthy();
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });
  });
});
