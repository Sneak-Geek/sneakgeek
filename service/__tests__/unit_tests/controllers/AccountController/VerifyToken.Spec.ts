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

const url = "/api/v1/account/verify-token";

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

  describe("POST /verify-token: Verify token using valid token", () => {
    beforeAll(async () => {
      container.snapshot();

      sinon.stub(Query.prototype, "exec").returns(Promise.resolve({}));

      const token = faker.random.words();
      res = await request(Server.instance).post(url).send({ token });
    });

    afterAll(() => {
      container.restore();
      sinon.restore();
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });
  });

  describe("POST /verify-token: Verify token without token", () => {
    beforeAll(async () => {
      res = await request(Server.instance)
        .post(url)
        .send({ email: faker.internet.email() });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe("POST /verify-token: Verify token using invalid token", () => {
    beforeAll(async () => {
      container.snapshot();

      const verificationRepo = container.get<Repository<Verification>>(
        Types.VerificationRepository
      );
      let verificationRepoFindOneStub = new Query<Verification>();
      sinon.stub(verificationRepo, "findOne").returns(verificationRepoFindOneStub);
      sinon.stub(verificationRepoFindOneStub, "exec").returns(Promise.resolve(undefined));

      res = await request(Server.instance)
        .post(url)
        .send({ email: faker.internet.email(), token: faker.random.words() });
    });

    afterAll(() => {
      container.restore();
      sinon.restore();
    });

    it(`Response status should be UNAUTHORIZED (${HttpStatus.UNAUTHORIZED})`, () => {
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
