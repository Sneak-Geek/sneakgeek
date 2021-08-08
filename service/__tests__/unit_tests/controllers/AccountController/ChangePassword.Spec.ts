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
import * as middlewares from "../../../../src/infra/middlewares";
import * as bcrypt from "bcrypt";
import { saltRounds } from "../../../../src/assets/constants";
import { Query } from "mongoose";

const url = "/api/v1/account/change-password";

describe(url, () => {
  let res: request.Response;
  let authMiddlewareStub: sinon.SinonStub;
  const container = Server.container;
  const seedPassword = faker.internet.password();

  beforeAll(async () => {
    authMiddlewareStub = sinon
      .stub(middlewares, "FirebaseAuthMiddleware")
      .callsFake(async (req, res, next) => {
        req.user = { password: bcrypt.hashSync(seedPassword, saltRounds) };
        return next();
      });
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    await Server.initAppAsync();
  });

  afterAll(() => {
    Server.exit();
  });

  describe("PATCH /change-password: Change password using valid currentPassword", () => {
    beforeAll(async () => {
      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);

      let userRepoUpdateOneStub = new Query<UserAccount>();
      sinon.stub(userRepo, "updateOne").returns(userRepoUpdateOneStub);
      sinon.stub(userRepoUpdateOneStub, "exec").returns(Promise.resolve({} as UserAccount));
      sinon.stub(bcrypt, "compare").returns(Promise.resolve(true));

      const currentPassword = seedPassword;
      const newPassword = faker.internet.password();

      res = await request(Server.instance)
        .patch(url)
        .send({ currentPassword, newPassword });
    });

    afterAll(() => {
      sinon.restore();
      container.restore();
    });

    it(`Status response should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });

    it("FirebaseAuthMiddleware should be called once", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /change-password: Change password using invalid currentPassword", () => {
    beforeAll(async () => {
      const currentPassword = faker.internet.password();
      const newPassword = faker.internet.password();
      res = await request(Server.instance)
        .patch(url)
        .send({ currentPassword, newPassword });
    });

    it(`Response status should be UNAUTHORIZED (${HttpStatus.UNAUTHORIZED})`, () => {
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    it("FirebaseAuthMiddleware should be called once", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /change-password: Change password without currentPassword", () => {
    beforeAll(async () => {
      const newPassword = faker.internet.password();
      res = await request(Server.instance).patch(url).send({ newPassword });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("FirebaseAuthMiddleware should be called once", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /change-password: Change password using empty currentPassword", () => {
    beforeAll(async () => {
      const currentPassword = "";
      const newPassword = faker.internet.password();
      res = await request(Server.instance)
        .patch(url)
        .send({ currentPassword, newPassword });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("FirebaseAuthMiddleware should be called once", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /change-password: Change password without newPassword", () => {
    beforeAll(async () => {
      const currentPassword = faker.internet.password();
      res = await request(Server.instance).patch(url).send({ currentPassword });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("FirebaseAuthMiddleware should be called once", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });

  describe("PATCH /change-password: Change password using empty newPassword", () => {
    beforeAll(async () => {
      const currentPassword = faker.internet.password();
      const newPassword = "";
      res = await request(Server.instance)
        .patch(url)
        .send({ currentPassword, newPassword });
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    it("FirebaseAuthMiddleware should be called once", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });
});
