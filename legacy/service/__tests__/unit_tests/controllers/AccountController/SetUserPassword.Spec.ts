//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import HttpStatus from "http-status";
import Server from "../../../../src/Server";
import sinon from "sinon";
import { BootstrapProvider } from "../../../../src/infra/providers";
import { Repository, Verification } from "../../../../src/infra/database";
import { Types } from "../../../../src/configuration/inversify";
import faker from "faker";
import { Query } from "mongoose";

const url = "/api/v1/account/set-user-password";

describe(url, () => {
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

  describe("PUT /set-user-password: Set user password using valid credential", () => {
    beforeAll(async () => {
      container.snapshot();

      sinon.stub(Query.prototype, "exec").returns(Promise.resolve({}));

      const email = faker.internet.email();
      const newPassword = faker.internet.password();
      const token = faker.random.words();
      res = await request(Server.instance).put(url).send({ email, newPassword, token });
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });
  });

  describe("PUT /set-user-password: Set user password without newPassword", () => {
    beforeAll(async () => {
      const email = faker.internet.email();
      const token = faker.random.words();
      res = await request(Server.instance).put(url).send({ email, token });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe("PUT /set-user-password: Set user password without token", () => {
    beforeAll(async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      res = await request(Server.instance).put(url).send({ email, password });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe("PUT /set-user-password: Set user using invalid token", () => {
    beforeAll(async () => {
      container.snapshot();

      const verificationRepo = container.get<Repository<Verification>>(
        Types.VerificationRepository
      );
      let verificationRepoFindOneStub = new Query<Verification>();
      sinon.stub(verificationRepo, "findOne").returns(verificationRepoFindOneStub);
      sinon.stub(verificationRepoFindOneStub, "exec").returns(Promise.resolve(undefined));

      const email = faker.internet.email();
      const newPassword = faker.internet.password();
      const token = faker.random.words();
      res = await request(Server.instance).put(url).send({ email, newPassword, token });
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });

    it(`Response status should be UNAUTHORIZED (${HttpStatus.UNAUTHORIZED})`, () => {
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
