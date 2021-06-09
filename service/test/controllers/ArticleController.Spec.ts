//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import supertest, { Response } from "supertest";
import Server from "../../src/Server";
import { expect } from "chai";
import HttpStatus from "http-status";
import { name, lorem, date } from "faker";

let authorization = "";

describe("Article", function () {
  before("Setup server and authorization token", function (done) {
    const accessToken = process.env.FB_TEST_ACCOUNT_TOKEN;
    Server.initAppAsync().then(function (_instance) {
      supertest(Server.instance)
        .post("/api/v1/account/facebook")
        .set({ access_token: accessToken })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          authorization = res.body.token;
          done();
        });
    });
  });

  after("Exit server", function (done) {
    Server.exit();
    done();
  });

  describe("Create article - POST /create", function () {
    it("When create with title and mdBody, server creates a new article", function (done) {
      const title = name.title();
      const mdBody = lorem.paragraph();
      supertest(Server.instance)
        .post("/api/v1/article/create")
        .set("authorization", authorization)
        .send({ title: title, markdownBody: mdBody })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.CREATED);
          done();
        });
    });

    it("When create using used title, server returns http.INTERNAL_SERVER_ERR", function (done) {
      const title = name.title();
      const mdBody = lorem.paragraph();
      supertest(Server.instance)
        .post("/api/v1/article/create")
        .set("authorization", authorization)
        .send({ title: title, markdownBody: mdBody })

        .then(() => {
          const anotherMdBody = lorem.paragraph();
          supertest(Server.instance)
            .post("/api/v1/article/create")
            .set("authorization", authorization)
            .send({ title: title, markdownBody: anotherMdBody })
            .end(function (err: any, res: Response) {
              if (err) {
                done(err);
              }
              expect(res.status).to.be.eq(HttpStatus.INTERNAL_SERVER_ERROR);
              done();
            });
        });
    });

    it("When create without title, server returns http.BAD_REQUEST", function (done) {
      const mdBody = lorem.paragraph();
      supertest(Server.instance)
        .post("/api/v1/article/create")
        .set("authorization", authorization)
        .send({ markdownBody: mdBody })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.BAD_REQUEST);
          done();
        });
    });

    it("When create without mdBody, server returns http.BAD_REQUEST", function (done) {
      const title = name.title();
      supertest(Server.instance)
        .post("/api/v1/article/create")
        .set("authorization", authorization)
        .send({ title: title })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("Delete article - PUT /delete", function () {
    it("When delete an existing article, server returns http.OK", function (done) {
      const title = name.title();
      const mdBody = lorem.paragraph();
      supertest(Server.instance)
        .post("/api/v1/article/create")
        .set("authorization", authorization)
        .send({ title: title, markdownBody: mdBody })

        .then(() => {
          supertest(Server.instance)
            .put("/api/v1/article/delete")
            .set("authorization", authorization)
            .send({ title: title })
            .end(function (err: any, res: Response) {
              if (err) {
                done(err);
              }
              expect(res.status).to.be.eq(HttpStatus.OK);
              done();
            });
        });
    });

    it("When delete non-exist article, server returns http.NOT_FOUND", function (done) {
      const randomTitle = name.title();
      supertest(Server.instance)
        .put("/api/v1/article/delete")
        .set("authorization", authorization)
        .send({ title: randomTitle })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.NOT_FOUND);
          done();
        });
    });

    it("When delete without title, server returns http.BAD_REQUEST", function (done) {
      supertest(Server.instance)
        .put("/api/v1/article/delete")
        .set("authorization", authorization)
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  describe("Find article by date - GET /get-html-by-date", function () {
    it("When find article using from and to, server returns corresponding articles", function (done) {
      const from = date.past();
      const to = date.future();
      supertest(Server.instance)
        .get("/api/v1/article/get-html-by-date")
        .set("authorization", authorization)
        .query({ from: from, to: to })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.OK);
          done();
        });
    });

    it("When find article using only from, server returns corresponding articles", function (done) {
      const from = date.past();
      supertest(Server.instance)
        .get("/api/v1/article/get-html-by-date")
        .set("authorization", authorization)
        .query({ from: from })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.OK);
          done();
        });
    });

    it("When find article without from, server returns http.BAD_REQUEST", function (done) {
      const to = date.future();
      supertest(Server.instance)
        .get("/api/v1/article/get-html-by-date")
        .set("authorization", authorization)
        .query({ to: to })
        .end(function (err: any, res: Response) {
          if (err) {
            done(err);
          }
          expect(res.status).to.be.eq(HttpStatus.BAD_REQUEST);
          done();
        });
    });
  });
});
