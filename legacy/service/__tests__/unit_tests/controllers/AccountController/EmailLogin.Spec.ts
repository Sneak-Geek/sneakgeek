//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import * as faker from "faker";
import HttpStatus from "http-status";
import Server from "../../../../src/Server";
import sinon from "sinon";
import { BootstrapProvider } from "../../../../src/infra/providers";
import { Repository, UserAccount } from "../../../../src/infra/database";
import { Types } from "../../../../src/configuration/inversify";
import { Query } from "mongoose";
import { hashSync } from "bcrypt";
import { saltRounds } from "../../../../src/assets";

describe("/api/v1/account/email-login", () => {
  let res: request.Response;
  const container = Server.container;

  beforeAll(async () => {
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    await Server.initAppAsync();
  });

  afterAll(() => {
    Server.exit();
  });

  describe("POST /email-login: Login with valid email and password", () => {
    beforeAll(async () => {
      container.snapshot();

      let email = faker.internet.email();
      let password = faker.internet.password();

      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);
      let userRepoFindOneStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findOne").returns(userRepoFindOneStub);
      sinon.stub(userRepoFindOneStub, "exec").resolves({
        id: faker.random.uuid(),
        password: hashSync(password, saltRounds),
      } as UserAccount);

      res = await request(Server.instance)
        .post("/api/v1/account/email-login")
        .send({ email, password });
    });

    afterAll(async () => {
      container.restore();
      sinon.restore();
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });
  });

  describe("POST /email-login: Log in with invalid email", () => {
    beforeAll(async () => {
      res = await request(Server.instance).post("/api/v1/account/email-login").send({
        email: faker.name.firstName(),
        password: faker.internet.password(),
      });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe("POST /email-login: Log in without email", () => {
    beforeAll(async () => {
      res = await request(Server.instance).post("/api/v1/account/email-login").send({
        password: faker.internet.password(),
      });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
