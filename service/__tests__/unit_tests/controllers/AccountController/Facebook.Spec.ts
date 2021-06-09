//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import request from "supertest";
import * as faker from "faker";
import HttpStatus from "http-status";
import FacebookTokenStrategy from "passport-facebook-token";
import Server from "../../../../src/Server";
import { UserRequiredProperties } from "./constants";
import sinon from "sinon";
import { BootstrapProvider } from "../../../../src/infra/providers";
import { Repository, UserAccount } from "../../../../src/infra/database";
import { Types } from "../../../../src/configuration/inversify";
import { Query } from "mongoose";

describe("/api/v1/account/facebook", () => {
  let res: request.Response;

  beforeAll(async () => {
    sinon.stub(BootstrapProvider.prototype, "bootstrapUsersData").returns(null);
    sinon.stub(BootstrapProvider.prototype, "bootstrapShoesData").returns(null);
    await Server.initAppAsync();
  });

  afterAll(() => {
    Server.exit();
  });

  describe("POST /facebook: Proceeds with valid token for new user", () => {
    // Make request to server
    beforeAll(async () => {
      // Mocking facebook
      jest.mock("passport-facebook-token");
      FacebookTokenStrategy.prototype.userProfile = jest
        .fn()
        .mockImplementationOnce((_accessToken: string, done: Function) => {
          done(null, {
            provider: "facebook",
            id: faker.random.uuid(),
            displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
            name: {
              familyName: faker.name.firstName(),
              givenName: "",
              middleName: faker.name.lastName(),
            },
            gender: "",
            emails: [faker.internet.email()],
            photos: [],
          });
        });

      res = await request(Server.instance)
        .post("/api/v1/account/facebook")
        .set({ access_token: faker.random.words() });
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

    it("User should have password property", () => {
      expect(res.body.user).not.toHaveProperty("password");
    });
  });

  describe("POST /facebook: Proceeds with valid token for existing user", () => {
    // Make request to server
    beforeAll(async () => {
      Server.container.snapshot();

      // Mocking facebook
      jest.mock("passport-facebook-token");
      FacebookTokenStrategy.prototype.userProfile = jest
        .fn()
        .mockImplementationOnce((_accessToken: string, done: Function) => {
          done(null, {
            provider: "facebook",
            id: faker.random.uuid(),
            displayName: `${faker.name.firstName()} ${faker.name.lastName()}`,
            name: {
              familyName: faker.name.firstName(),
              givenName: "",
              middleName: faker.name.lastName(),
            },
            gender: "",
            emails: [faker.internet.email()],
            photos: [],
          });
        });

      const userRepo = Server.container.get<Repository<UserAccount>>(
        Types.AccountRepository
      );
      const userRepoFindOneStub = new Query<UserAccount>();
      sinon.stub(userRepo, "findOne").returns(userRepoFindOneStub);
      sinon.stub(userRepoFindOneStub, "exec").resolves({ isVerified: true } as UserAccount);

      res = await request(Server.instance)
        .post("/api/v1/account/facebook")
        .set({ access_token: faker.random.words() });
    });

    afterAll(() => {
      sinon.restore();
      Server.container.restore();
    });

    it(`Response status should be OK (${HttpStatus.OK})`, () => {
      expect(res.status).toEqual(HttpStatus.OK);
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

    it("User should have password property", () => {
      expect(res.body.user).not.toHaveProperty("password");
    });
  });

  describe("POST /facebook: Proceeds with unauthorized token", () => {
    beforeAll(async () => {
      // Mocking facebook
      jest.mock("passport-facebook-token");
      FacebookTokenStrategy.prototype.userProfile = jest
        .fn()
        .mockImplementationOnce((_accessToken: string, _: Function) => {
          const error = new Error();
          error.name = "InternalOAuthError";
          throw error;
        });

      res = await request(Server.instance).post("/api/v1/account/facebook").set({
        access_token: "token",
      });
    });

    it(`Response status should be UNAUTHORIZED (${HttpStatus.UNAUTHORIZED})`, () => {
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });
});
