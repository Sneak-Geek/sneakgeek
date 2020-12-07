//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import {
  controller,
  httpGet,
  queryParam,
  response,
  httpPost,
  request,
} from "inversify-express-utils";
import { inject } from "inversify";
import { Types } from "../../configuration/inversify";
import { ICdnService, CdnContainerName } from "../services";
import { query } from "express-validator";
import * as middlewares from "../middlewares";
import { Response, Request } from "express";
import HttpStatus from "http-status";
import { LogProvider } from "../providers";

@controller("/api/v1/image")
export class ImageController {
  @inject(Types.CdnService)
  private readonly cdnService!: ICdnService;

  @httpGet(
    "/",
    middlewares.AuthMiddleware,
    query("count").isInt({ min: 1 }),
    query("type").isIn(["User", "Order"]),
    middlewares.ValidationPassedMiddleware
  )
  public async getSignedImageUrls(
    @queryParam("count") count: number,
    @queryParam("type")
    folderType: CdnContainerName.User | CdnContainerName.Order,
    @response() res: Response
  ) {
    const signedImages = await this.cdnService.generateSignedLinkForImg(folderType, count);
    return res.status(HttpStatus.CREATED).send(signedImages);
  }

  @httpPost("/upload", Types.AzCdnMulterMiddlware)
  public async uploadImage(@request() req: Request, @response() res: Response) {
    const files = req.files as Express.Multer.File[];

    try {
      return res.status(HttpStatus.OK).send({
        message: "success",
        urls: files.map((f) => f.destination),
      });
    } catch (error) {
      LogProvider.instance.error("Image upload error", error.stack);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "failed",
      });
    }
  }
}
