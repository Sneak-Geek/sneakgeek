// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Request, Response } from "express";
import { body, query } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  httpPost,
  httpPut,
  queryParam,
  request,
  response,
} from "inversify-express-utils";
import { ObjectId } from "mongodb";
import { Types } from "../../configuration/inversify/inversify.types";
import * as middlewares from "../middlewares";
import { Gender, Brand } from "../../assets/settings";
import { Repository, Shoe } from "../database";
import mongoose from "mongoose";
import { IShoeDao } from "../../infra/dao";
import { UpdateShoeInput } from "../model";
import { plainToClass } from "@marcj/marshal";
import { ISearchService } from "../services";

@controller("/api/v1/shoe")
export class ShoeController {
  @inject(Types.ShoeRepository)
  private readonly shoeRepo!: Repository<Shoe>;

  @inject(Types.ShoeDao)
  private readonly shoeDao!: IShoeDao;

  @inject(Types.SearchService)
  private readonly searchService: ISearchService;

  @httpGet("/all")
  public async getAllShoes(@response() res: Response) {
    const [nike, jordan, adidas] = await Promise.all([
      this._getShoesByBrand(Brand.Nike),
      this._getShoesByBrand(Brand.Jordan),
      this._getShoesByBrand(Brand.adidas),
    ]);

    return res.status(200).send(nike.concat(jordan).concat(adidas));
  }

  private _getShoesByBrand(brand: Brand): Promise<Shoe[]> {
    return this.shoeRepo
      .find({ brand, imageUrl: { $exists: true, $ne: "" } })
      .limit(50)
      .sort({ releaseDate: -1 })
      .exec();
  }

  @httpPost("/create")
  public async createShoeAsync(@request() req: Request, @response() res: Response) {
    try {
      const { shoes } = req.body;

      if (!shoes || typeof shoes !== "object" || shoes.length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Malformed shoes data",
        });
      }

      await this.shoeRepo.insertMany(
        shoes.map((rawShoe) => ({
          brand: rawShoe.brand,
          category: rawShoe.category,
          colorway: rawShoe.colorway,
          description: rawShoe.description,
          gender: rawShoe.gender,
          releaseDate: rawShoe.releaseDate ? new Date(rawShoe.releaseDate) : undefined,
          retailPrice: rawShoe.retailPrice,
          name: rawShoe.name,
          styleId: rawShoe.styleId,
          imageUrl: rawShoe.imageUrl,
          title: rawShoe.title,
        })),
        { ordered: false }
      );

      return res.status(HttpStatus.CREATED).json({
        message: "Successfully save shoe(s)!",
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpGet("/count")
  public async countAllAsync(@response() res: Response) {
    const count = await this.shoeRepo.countDocuments({});
    return res.status(HttpStatus.OK).send({
      total: count,
    });
  }

  @httpGet(
    "/find",
    query("page").exists().isInt({ min: 0 }),
    query("title").optional().isString(),
    query("gender").optional().isIn(Object.keys(Gender)),
    query("brand").isString().optional(),
    middlewares.ValidationPassedMiddleware
  )
  public async findShoeAsync(@request() req: Request, @response() res: Response) {
    const limit = 20;
    const page = parseInt(req.query.page as string, 10);
    const title = (req.query.title as string) || "";
    const gender = req.query.gender as string;
    const brand: string[] = ((req.query.brand as string) || "")
      .split(",")
      .filter((t) => t.length > 0);

    const result = await this.searchService.search(page, limit, title, brand, gender);

    return res.status(HttpStatus.OK).send(result);
  }

  @httpGet("/get", middlewares.FirebaseAuthMiddleware)
  public async getShoesByIds(@queryParam("ids") rawIds: string, @response() res: Response) {
    const ids = rawIds.split(",").map((t) => new ObjectId(t));
    const shoes: Array<Shoe> = await this.shoeRepo.find({ _id: { $in: ids } }).exec();

    return res.status(HttpStatus.OK).send(shoes);
  }

  @httpGet("/detail", query("shoeId").isMongoId(), middlewares.ValidationPassedMiddleware)
  public async getShoeInformation(
    @queryParam("shoeId") shoeId: string,
    @response() res: Response
  ) {
    const shoe = await this.shoeRepo.findById(shoeId);
    if (!shoe) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Shoe not found",
      });
    }

    const relatedShoes = await this.shoeRepo
      .find({
        category: shoe.category,
        imageUrl: { $ne: "" },
        _id: { $ne: mongoose.Types.ObjectId(shoeId) },
      })
      .limit(10);

    return res.status(HttpStatus.OK).send({
      relatedShoes,
    });
  }

  @httpPut(
    "/update",
    middlewares.FirebaseAuthMiddleware,
    middlewares.AccountVerifiedMiddleware,
    middlewares.AdminPermissionMiddleware,
    body("shoeId").isMongoId().exists(),
    body("brand").optional().isString(),
    body("category").optional().isString(),
    body("colorway").optional().isArray(),
    body("colorway[*]").optional().isString(),
    body("description").optional().isString(),
    body("gender").optional().isString(),
    body("releaseDate").optional().isISO8601(),
    body("retailPrice").optional().isNumeric(),
    body("name").optional().isString(),
    body("shoe").optional().isString(),
    body("styleId").optional().isString(),
    body("imageUrl").optional().isString(),
    body("tags").optional().isArray(),
    body("tags[*]").optional().isMongoId(),
    middlewares.ValidationPassedMiddleware
  )
  public async updateShoe(@request() req: Request, @response() res: Response) {
    const updateShoeInput = plainToClass(UpdateShoeInput, req.body);
    const updatedShoe = await this.shoeDao.updateShoe(updateShoeInput);
    await this.searchService.updateShoe(updateShoeInput);
    return res.status(HttpStatus.OK).send({
      updatedShoe,
    });
  }

  @httpGet("brands", middlewares.FirebaseAuthMiddleware, middlewares.ValidationPassedMiddleware)
  public async getAllBrands(@response() res: Response) {
    try {
      const brands = await this.shoeRepo.distinct("brand").exec();
      return res.status(HttpStatus.OK).send({
        brands,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        error,
      });
    }
  }
}
