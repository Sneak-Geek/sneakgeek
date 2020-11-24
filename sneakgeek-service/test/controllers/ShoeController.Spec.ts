//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import supertest, { Response } from "supertest";
import Server from "../../src/Server";
import { expect } from "chai";
import HttpStatus from "http-status";

describe("/POST create shoe", () => {
  before("Setup server", (done) => {
    Server.initAppAsync().then((_instance) => done());
  });

  after("Exit server", (done) => {
    Server.exit();
    done();
  });

  it("Post valid shoe", (done) => {
    supertest(Server.instance)
      .post("/api/v1/shoe/create")
      .send({
        shoes: [
          {
            brand: "Nike",
            category: "category",
            colorway: ["University Red"],
            description: "",
            gender: "men",
            imageUrl: "",
            name: "Air Jordan 1",
            releaseDate: new Date(),
            retailPrice: 200,
            shoe: "AJ1",
            title: "AJ1 retro",
            styleId: "abdf",
          },
        ],
      })
      .end((err: any, resp: Response) => {
        if (err) {
          done(err);
        }

        expect(resp.status).to.be.eq(HttpStatus.CREATED);
        expect(resp.body.total).to.be.greaterThan(0);

        done();
      });
  });

  it("Then total count should be at least 1", (done) => {
    supertest(Server.instance)
      .get("/api/v1/shoe/count")
      .end((err, resp: Response) => {
        if (err) {
          done(err);
        }

        expect(resp.status).to.be.eq(HttpStatus.OK);
        expect(resp.body.total).to.be.greaterThan(0);

        done();
      });
  });

  it("Then the created shoe should have enough field", (done) => {
    supertest(Server.instance)
      .get("/api/v1/shoe/find?brand=Nike")
      .end((err, resp) => {
        if (err) {
          done(err);
        }

        const shoe = resp.body.shoe;

        expect(resp.status).to.be.eq(HttpStatus.OK);
        expect(shoe).to.haveOwnProperty("createdAt");

        done();
      });
  });
});
