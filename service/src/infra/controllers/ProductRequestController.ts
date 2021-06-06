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
  request,
  response,
  queryParam,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify/inversify.types";
import { Gender } from "../../assets/settings";
import { ValidationPassedMiddleware } from "../middlewares";
import { Repository, ProductRequest, RequestStatus } from "../database";

@controller("/api/v1/product-request")
export class ProductRequestController {
  @inject(Types.ProductRequestRepository)
  private readonly productRequestRepo!: Repository<ProductRequest>;

  @httpPost(
    "/",
    body("title").isString(),
    body("brand").isString(),
    body("gender").optional().isIn(Object.keys(Gender)),
    body("imageUrls").optional().isArray(),
    body("imageUrls[*]").optional().isURL(),
    ValidationPassedMiddleware
  )
  public async requestProductAsync(@request() req: Request, @response() res: Response) {
    try {
      const { title, brand, gender, size, colorways, imageUrls } = req.body;
      let requestProduct = await this.productRequestRepo.create({
        title: title,
        brand: brand,
        gender: gender ? gender : undefined,
        size: size ? size : undefined,
        colorways: colorways || [],
        imageUrls: imageUrls || [],
      } as ProductRequest);

      return res.status(HttpStatus.CREATED).send({
        message: "Request product successfully.",
        requestedProduct: requestProduct,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal server error!",
      });
    }
  }

  @httpGet(
    "/",
    query("requestStatus").optional().isIn(Object.keys(RequestStatus)),
    ValidationPassedMiddleware
  )
  public async getRequestedProductAsync(
    @queryParam("requestStatus") requestStatus: RequestStatus,
    @response() res: Response
  ) {
    try {
      const filter = requestStatus ? { where: { requestStatus: requestStatus } } : {};
      const requestedProducts = await this.productRequestRepo.find(filter).exec();

      return res.status(HttpStatus.OK).send({
        requestedProducts: requestedProducts,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal server error!",
      });
    }
  }
}
