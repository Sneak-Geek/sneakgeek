// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Request, Response } from "express";
import { body, param, query } from "express-validator";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  request,
  response,
  httpPut,
  queryParam,
} from "inversify-express-utils";
import { Repository, Catalogue, CatalogType } from "../database";
import { Types } from "../../configuration/inversify/inversify.types";
import { AuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import HttpStatus from "http-status";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

@controller("/api/v1/catalogue")
export class CatalogueController {
  @inject(Types.CatalogueRepository)
  private readonly catalogueRepo!: Repository<Catalogue>;

  @httpPost(
    "/",
    body("title").isString(),
    body("description").optional().isString(),
    body("productIds").isArray(),
    body("productIds[*]").isMongoId(),
    body("coverImage").optional().isURL(),
    body("catalogType").isString().isIn(Object.keys(CatalogType)),
    body("showOnHomepagePriority").optional().isInt({ min: 0 }),
    ValidationPassedMiddleware
  )
  public async createCatalogue(@request() req: Request, @response() res: Response) {
    try {
      const {
        title,
        description,
        productIds,
        coverImage,
        showOnHomepagePriority,
        catalogType,
      } = req.body;
      await this.catalogueRepo.create({
        title,
        description,
        productIds: productIds.map((productId: string) => {
          return mongoose.Types.ObjectId(productId);
        }),
        catalogType,
        coverImage,
        showOnHomepagePriority,
      });
      return res
        .status(HttpStatus.CREATED)
        .send({ message: "Create catalogue successfully!" });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error!" });
    }
  }

  @httpGet("/all")
  public async getAllCatalogue(@response() res: Response) {
    const catalogues = await this.catalogueRepo
      .find()
      .populate({
        path: "products",
      })
      .exec();

    return res.status(HttpStatus.OK).send(catalogues);
  }

  @httpPut(
    "/:catalogueId",
    param("catalogueId").isMongoId(),
    body("title").optional().isString(),
    body("description").optional().isString(),
    body("productIds").optional().isArray(),
    body("productIds[*]").optional().isMongoId(),
    body("coverImage").optional().isURL(),
    body("catalogType").optional().isIn(Object.keys(CatalogType)),
    body("showOnHomepagePriority").optional().isInt({ min: 0 }),
    ValidationPassedMiddleware
  )
  public async editCatalogue(@request() req: Request, @response() res: Response) {
    const { catalogueId } = req.params;
    try {
      let catalogue = await this.catalogueRepo.findOne({
        _id: new ObjectId(catalogueId),
      });

      if (!catalogue) {
        return res.status(HttpStatus.NOT_FOUND).send({
          message: "Catalogue not found!",
        });
      }

      delete req.body._id;
      catalogue = Object.assign(catalogue, req.body);
      await this.catalogueRepo
        .updateOne({ _id: new ObjectId(catalogueId) }, catalogue)
        .exec();

      return res.status(HttpStatus.OK).send({
        message: "Edit catalogue successfully!",
      });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "Unexpected error!" });
    }
  }

  @httpGet("/", query("tag").exists().isString(), ValidationPassedMiddleware)
  public async getCatalogs(@queryParam("tag") tag: string, @response() res: Response) {
    const catalog = await this.catalogueRepo
      .findOne({ tags: tag })
      .populate("products")
      .exec();

    return res.status(200).send({ catalog });
  }
}
