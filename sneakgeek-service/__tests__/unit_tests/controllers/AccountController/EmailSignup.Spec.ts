//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import * as faker from "faker";
import HttpStatus from "http-status";
import Server from "../../../../src/Server";
import sinon from "sinon";
import { EmailService } from "../../../../src/infra/services";
import { UserRequiredProperties } from "./constants";
import { BootstrapProvider } from "../../../../src/infra/providers";

describe("/api/v1/account/email-signup", () => {
  let res: request.Response;

  beforeAll(async () => {
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    await Server.initAppAsync();
  });

  afterAll(() => {
    Server.exit();
  });

  describe("POST /email-signup: Sign up with valid request body", () => {
    let sendMailStub: sinon.SinonStub;

    beforeAll(async () => {
      // Setting up stub
      sendMailStub = sinon.stub(EmailService.prototype, "sendVerificationEmail");

      res = await request(Server.instance).post("/api/v1/account/email-signup").send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    });

    afterAll(async () => {
      await Server.dropDatabase();
    });

    it(`Response status should be CREATED (${HttpStatus.CREATED})`, () => {
      expect(res.status).toEqual(HttpStatus.CREATED);
    });

    it("Response body should have non-empty token property", () => {
      expect(res.body).toHaveProperty("token");
      expect(res.body.token).not.toHaveLength(0);
    });

    it("Response body should have non-empty user property", () => {
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).not.toBeNull();
      expect(res.body.user).not.toBeUndefined();
    });

    it("User should have required properties", () => {
      UserRequiredProperties.forEach((property) => {
        expect(res.body.user).toHaveProperty(property);
      });
    });

    it("User should not have a password field", () => {
      expect(res.body.user).not.toHaveProperty("password");
    });

    it("Send verification email should be called", () => {
      expect(sendMailStub.calledOnce).toBeTruthy();
    });
  });

  describe("POST /email-signup: Sign up with missing (partial) request body", () => {
    let missingAllRes: request.Response;
    let missingEmailRes: request.Response;
    let missingPasswordRes: request.Response;

    beforeAll(async () => {
      missingAllRes = await request(Server.instance)
        .post("/api/v1/account/email-signup")
        .send({});
      missingEmailRes = await request(Server.instance)
        .post("/api/v1/account/email-signup")
        .send({
          password: faker.internet.password(),
        });
      missingPasswordRes = await request(Server.instance)
        .post("/api/v1/account/email-signup")
        .send({
          email: faker.internet.email(),
        });
    });

    afterAll(() => {
      Server.dropDatabase();
    });

    it(`All responses' status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(missingEmailRes.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(missingPasswordRes.status).toEqual(HttpStatus.BAD_REQUEST);
      expect(missingAllRes.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  describe("POST /email-signup: Sign up with invalid email", () => {
    beforeAll(async () => {
      res = await request(Server.instance).post("/api/v1/account/email-signup").send({
        email: faker.name.firstName(),
        password: faker.internet.password(),
      });
    });

    afterAll(() => {
      Server.dropDatabase();
    });

    it(`Response status should be BAD_REQUEST (${HttpStatus.BAD_REQUEST})`, () => {
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
