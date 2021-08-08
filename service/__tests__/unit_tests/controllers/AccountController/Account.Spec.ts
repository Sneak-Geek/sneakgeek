//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import HttpStatus from "http-status";
import Server from "../../../../src/Server";
import sinon from "sinon";
import { BootstrapProvider } from "../../../../src/infra/providers";
import * as middlewares from "../../../../src/infra/middlewares";

describe("/api/v1/account", () => {
  let res: request.Response;
  let authMiddlewareStub: sinon.SinonStub;

  beforeAll(async () => {
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    authMiddlewareStub = sinon
      .stub(middlewares, "FirebaseAuthMiddleware")
      .callsFake(async (req, res, next) => {
        req.user = {};
        return next();
      });
    await Server.initAppAsync();
  });

  afterAll(() => {
    sinon.restore();
    Server.exit();
  });

  describe("GET /: Get account with authorized token", () => {
    beforeAll(async () => {
      res = await request(Server.instance).get("/api/v1/account");
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
    });

    it("FirebaseAuthMiddleware should be called", () => {
      expect(authMiddlewareStub.called).toBeTruthy();
    });
  });
});
