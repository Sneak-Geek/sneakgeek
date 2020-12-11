import { Request, Response } from "express";
import { body } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpGet,
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

  @httpGet(
    "/",
    middlewares.AuthMiddleware,
    middlewares.AccountVerifiedMiddleware,
    Types.IsSellerMiddleware
  )
  public async getInventories(@request() req: Request, @response() res: Response) {
    const profileId = req.user.profile as mongoose.Types.ObjectId;
    console.log(profileId);
    const inventoryWithShoe = await this.inventoryDao.findByUserId(profileId.toHexString());
    return res.status(HttpStatus.OK).send(inventoryWithShoe);
  }

  @httpPost(
    "/new",
    middlewares.AuthMiddleware,
    middlewares.AccountVerifiedMiddleware,
    Types.IsSellerMiddleware,
    body("shoeId").isString(),
    body("quantity").isInt({ min: 0 }),
    body("sellPrice").isInt({ min: 0 }),
    body("shoeSize").isString(),
    middlewares.ValidationPassedMiddleware
  )
  public async sellShoes(
    @request() req: Request,
    @requestBody() inventoryBody: CreateInventoryDto,
    @response() res: Response
  ) {
    const user = req.user as UserAccount;
    const profileId = user.profile as mongoose.Types.ObjectId;
    if (
      await this.inventoryDao.isDuplicate(
        profileId.toHexString(),
        inventoryBody.shoeId,
        inventoryBody.shoeSize
      )
    ) {
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
    await this.inventoryDao.create({
      sellerId: profileId.toString(),
      ...inventoryBody,
    });
    return res.status(HttpStatus.OK).send();
  }

  @httpGet("/selling")
  public async getCurrentlySelling(@response() res: Response) {
    const result = await this.inventoryDao.getCurrentlySelling();
    return res.status(HttpStatus.OK).send(result);
  }
}
