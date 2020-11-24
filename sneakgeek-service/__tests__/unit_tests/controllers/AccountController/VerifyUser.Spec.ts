//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import HttpStatus from "http-status";
import Server from "../../../../src/Server";
import sinon from "sinon";
import { BootstrapProvider } from "../../../../src/infra/providers";
import { Repository, Verification, UserAccount } from "../../../../src/infra/database";
import { Types } from "../../../../src/configuration/inversify";
import faker from "faker";
import { Query } from "mongoose";

describe("/api/v1/account/verify-user", () => {
  let res: request.Response;
  const container = Server.container;
  const url = "/api/v1/account/verify-user?verificationToken=";

  beforeAll(async () => {
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    await Server.initAppAsync();
  });

  afterAll(() => {
    Server.exit();
  });

  describe("GET /verify-user: Verify user using valid verificationToken and un-verified user", () => {
    beforeAll(async () => {
      container.snapshot();

      sinon.stub(Query.prototype, "exec").returns(Promise.resolve({ isVerified: false }));

      const token = faker.random.words();
      res = await request(Server.instance).get(`${url}${token}`);
    });

    afterAll(() => {
      container.restore();
      sinon.restore();
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });
  });

  describe("GET /verify-user: Verify user without using verificationToken", () => {
    beforeAll(async () => {
      res = await request(Server.instance).get(url);
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /verify-user: Verify user using non-existing verificationToken", () => {
    beforeAll(async () => {
      const token = faker.random.words();
      res = await request(Server.instance).get(`${url}${token}`);
    });

    it(`Response status should be NOT_FOUND (${HttpStatus.NOT_FOUND})`, () => {
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  describe("GET /verify-user: Verify non-existing user", () => {
    beforeAll(async () => {
      container.snapshot();

      const verificationRepo = container.get<Repository<Verification>>(
        Types.VerificationRepository
      );
      let verificationRepoFindOneStub = new Query<Verification>();
      sinon.stub(verificationRepo, "findOne").returns(verificationRepoFindOneStub);
      sinon
        .stub(verificationRepoFindOneStub, "exec")
        .returns(Promise.resolve({} as Verification));

      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);
      let userRepoFindByIdStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findById").returns(userRepoFindByIdStub);
      sinon.stub(userRepoFindByIdStub, "exec").returns(Promise.resolve(undefined));

      const token = faker.random.words();
      res = await request(Server.instance).get(`${url}${token}`);
    });

    it(`Response status should be NOT_FOUND (${HttpStatus.NOT_FOUND})`, () => {
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    afterAll(() => {
      container.restore();
      sinon.restore();
    });
  });

  describe("GET /verify-user: Verify already verified user", () => {
    beforeAll(async () => {
      container.snapshot();

      const verificationRepo = container.get<Repository<Verification>>(
        Types.VerificationRepository
      );
      let verificationRepoFindOneStub = new Query<Verification>();
      sinon.stub(verificationRepo, "findOne").returns(verificationRepoFindOneStub);
      sinon
        .stub(verificationRepoFindOneStub, "exec")
        .returns(Promise.resolve({} as Verification));

      const userRepo = container.get<Repository<UserAccount>>(Types.AccountRepository);
      let userRepoFindByIdStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findById").returns(userRepoFindByIdStub);
      sinon
        .stub(userRepoFindByIdStub, "exec")
        .returns(Promise.resolve({ isVerified: true } as UserAccount));

      const token = faker.random.words();
      res = await request(Server.instance).get(`${url}${token}`);
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    afterAll(() => {
      container.restore();
      sinon.restore();
    });
  });
});
