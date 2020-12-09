import { Request, Response } from "express";
import { body } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  requestBody,
  response,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify";
import { IInventoryDao } from "../dao";
import { CreateInventoryDto } from "../dao/InventoryDao/CreateInventoryDto";
import { UserAccount } from "../database";
import * as middlewares from "../middlewares";
import mongoose from "mongoose";

@controller("/api/v1/inventory")
export class InventoryController {
  @inject(Types.InventoryDao)
  private readonly inventoryDao!: IInventoryDao;

  @httpPost(
    "/new",
    middlewares.AuthMiddleware,
    middlewares.AccountVerifiedMiddleware,
    Types.IsSellerMiddleware,
    body("shoeId").isString(),
    body("quantity").isInt({ min: 0 }),
    body("sellPrice").isInt({ min: 0 }),
    body("shoeSize").isInt({ min: 0 }),
    middlewares.ValidationPassedMiddleware
  )
  public async sellShoes(
    @request() req: Request,
    @requestBody() inventoryBody: CreateInventoryDto,
    @response() res: Response
  ) {
    try {
      const user = req.user as UserAccount;
      const profile = user.profile as mongoose.Types.ObjectId;
      const _ = await this.inventoryDao.create({
        sellerId: profile.toString(),
        ...inventoryBody,
      });

      return res.status(HttpStatus.OK);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Internal server error",
      });
    }
  }
}
