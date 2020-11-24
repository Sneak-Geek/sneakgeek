// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { isValid, parse } from "date-fns";
import { Request, Response } from "express";
import { check, query, validationResult } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  request,
  response,
} from "inversify-express-utils";
import { Repository, Article } from "../database";
import { Types } from "../../configuration/inversify/inversify.types";
import * as middlewares from "../middlewares";
import { ICdnService } from "../services";
import { ObjectID } from "mongodb";

@controller("/api/v1/article")
export class ArticleController {
  @inject(Types.ArticleRepository)
  private readonly articleRepo!: Repository<Article>;

  @inject(Types.CdnService)
  private readonly s3Service!: ICdnService;

  @httpPost(
    "/create",
    middlewares.AuthMiddleware,
    check("title").isString(),
    check("markdownBody").isString(),
    middlewares.ValidationPassedMiddleware
  )
  public async createArticleAsync(@request() req: Request, @response() res: Response) {
    try {
      const { title, markdownBody } = req.body;
      const key = title.split(" ").join("_");
      const markdownKey = key + ".md";
      const htmlKey = key + ".html";

      await this.s3Service.uploadArticle(markdownBody, markdownKey, htmlKey);

      await this.articleRepo.create({
        title,
        markdownKey,
        htmlKey,
        createdByUser: new ObjectID(req.user._id),
      });

      return res.status(HttpStatus.CREATED).json({
        message: "Successfully save article!",
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpGet(
    "/get-html-by-date",
    middlewares.AuthMiddleware,
    middlewares.AccountVerifiedMiddleware,
    query("from").isString()
  )
  public async getHtmlArticleByDateAsync(
    @request() req: Request,
    @response() res: Response
  ) {
    const error = validationResult(req);
    const from = req.query.from as string;
    const to = req.query.to as string;

    if (!error.isEmpty() || !isValid(parse(from))) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        message: "Invalid request!",
      });
    }

    try {
      const laterThan = parse(from);
      const earlierThan =
        typeof to === "undefined" || !isValid(parse(to)) ? new Date() : parse(to);

      const dbArticles = await this.articleRepo.find({
        where: {
          createdAt: {
            $gte: laterThan,
            $lte: earlierThan,
          },
        },
      });

      const htmlContents = await Promise.all(
        dbArticles.map((article) => {
          return this.s3Service.getArticle(article.htmlKey);
        })
      );

      const results = dbArticles.map((dbArticle, idx) => {
        const resultArticle = {
          title: dbArticle.title,
          htmlBody: htmlContents[idx],
          createdByUser: dbArticle.createdByUser,
        };
        return resultArticle;
      });

      return res.status(HttpStatus.OK).send({ results });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpPut(
    "/delete",
    middlewares.AuthMiddleware,
    check("title").not().isEmpty(),
    middlewares.ValidationPassedMiddleware
  )
  public async deleteArticleAsync(@request() req: Request, @response() res: Response) {
    try {
      const title = req.body.title;
      const deletedArticle = await this.articleRepo.findOneAndDelete({ title }).exec();

      if (!deletedArticle) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: "Cannot find article!",
        });
      }

      const { htmlKey, markdownKey } = deletedArticle;
      await this.s3Service.deleteArticle(markdownKey, htmlKey);

      return res.status(HttpStatus.OK).send({
        message: "Successfully delete article!",
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }
}
