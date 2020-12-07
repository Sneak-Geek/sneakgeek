//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import HttpStatus from "http-status";
import Server from "../../../../src/Server";
import sinon from "sinon";
import { BootstrapProvider } from "../../../../src/infra/providers";
import { Repository, UserAccount, AccessLevel } from "../../../../src/infra/database";
import { Types } from "../../../../src/configuration/inversify";
import faker from "faker";
import * as middlewares from "../../../../src/infra/middlewares";
import { Query } from "mongoose";

const url = "/api/v1/account/set-access-level";

describe(url, () => {
  let res: request.Response;
  let authMiddlewareStub: sinon.SinonStub;
  const container = Server.container;
  const validMongoId = "5e534418a455d3df4524e3b1";

  beforeAll(async () => {
    authMiddlewareStub = sinon.stub(middlewares, "AuthMiddleware").callsArgAsync(2); // call next()
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    await Server.initAppAsync();
  });

  afterAll(() => {
    Server.exit();
  });

  describe("PATCH /set-access-level: Set access level using valid credential", () => {
    beforeAll(async () => {
      container.snapshot();

      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);

      let userRepoFindByIdAndUpdateStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findOneAndUpdate").returns(userRepoFindByIdAndUpdateStub);
      sinon
        .stub(userRepoFindByIdAndUpdateStub, "exec")
        .returns(Promise.resolve({} as UserAccount));

      const accessLevel = AccessLevel.Manager;
      const userId = validMongoId;
      res = await request(Server.instance).patch(url).send({ accessLevel, userId });
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });

    it("AuthMiddleware should be called", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /set-access-level: Set access level using invalid accessLevel (string not in AccessLevel)", () => {
    beforeAll(async () => {
      const accessLevel = faker.random.words();
      const userId = validMongoId;
      res = await request(Server.instance).patch(url).send({ accessLevel, userId });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("AuthMiddleware should be called", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /set-access-level: Set access level without accessLevel", () => {
    beforeAll(async () => {
      const userId = validMongoId;
      res = await request(Server.instance)
        .patch(url)
        .send({ userId })
        .set({ authorization: faker.random.words() });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("AuthMiddleware should be called", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /set-access-level: Set access level using invalid userId (not mongoId formatted)", () => {
    beforeAll(async () => {
      const userId = faker.random.words();
      const accessLevel = AccessLevel.User;
      res = await request(Server.instance)
        .patch(url)
        .send({ accessLevel, userId })
        .set({ authorization: faker.random.words() });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("AuthMiddleware should be called", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /set-access-level: Set access level without userId", () => {
    beforeAll(async () => {
      const accessLevel = AccessLevel.User;
      res = await request(Server.instance)
        .patch(url)
        .send({ accessLevel })
        .set({ authorization: faker.random.words() });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("AuthMiddleware should be called", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /set-access-level: Set access level of non-existing user", () => {
    beforeAll(async () => {
      container.snapshot();

      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);

      let userRepoFindByIdAndUpdateStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findOneAndUpdate").returns(userRepoFindByIdAndUpdateStub);
      sinon.stub(userRepoFindByIdAndUpdateStub, "exec").returns(Promise.resolve(undefined));

      const userId = validMongoId;
      const accessLevel = AccessLevel.Partner;

      res = await request(Server.instance).patch(url).send({ accessLevel, userId });
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });

    it(`Response status should be NOT_FOUND (${HttpStatus.NOT_FOUND})`, () => {
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    it("AuthMiddleware should be called", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });
});
