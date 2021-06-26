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
    Types.IsSellerMiddleware,
    query("shoeName").isString().optional(),
    middlewares.ValidationPassedMiddleware
  )
  public async getInventories(@request() req: Request, @response() res: Response) {
    const profileId = req.user.profile as mongoose.Types.ObjectId;
    const { shoeName } = req.query;
    const inventoryWithShoe = await this.inventoryDao.findByUserId(
      profileId.toHexString(),
      shoeName as string
    );
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

  @httpPut(
    "/update",
    middlewares.AuthMiddleware,
    middlewares.AccountVerifiedMiddleware,
    Types.IsSellerMiddleware,
    body("id").isMongoId(),
    body("shoeId").isMongoId(),
    body("shoeSize").isString(),
    body("sellPrice").isNumeric(),
    body("quantity").isNumeric(),
    middlewares.ValidationPassedMiddleware
  )
  public async updateInventory(@request() req: Request, @response() res: Response) {
    const inventoryId = req.body?.id as string;
    const inventory = await this.inventoryDao.findById(inventoryId);
    const updateInventory = Object.assign(inventory, {
      sellPrice: req.body.sellPrice,
      quantity: req.body.quantity,
      shoeSize: req.body.shoeSize,
    });
    await updateInventory.save();
    return res.status(HttpStatus.OK).send();
  }

  @httpGet("/selling")
  public async getCurrentlySelling(@response() res: Response) {
    const result = await this.inventoryDao.getCurrentlySelling();
    return res.status(HttpStatus.OK).send(result);
  }

  @httpGet("/lowest")
  public async getLowestPriceByShoe(
    @queryParam("shoeId") shoeId: string,
    @response() res: Response
  ) {
    const lowest = await this.inventoryDao.getLowestPrice(shoeId);

    return res.status(HttpStatus.OK).json({ price: lowest });
  }

  @httpGet(
    "/search",
    query("page").exists().isInt({ min: 0 }),
    query("title").optional().isString()
  )
  public async search(
    @queryParam("page") page: number | string,
    @queryParam("title") title: string,
    @response() res: Response
  ) {
    page = typeof page === "string" ? parseInt(page, 10) : page;

    const rawResult = await this.inventoryDao.findShoeInventoryWithPrice(page, title);
    const result = rawResult.map((r) => ({
      ...r.shoe,
      sellPrice: r.sellPrice,
      quantity: r.quantity,
    }));
    return res.status(HttpStatus.OK).send(result);
  }
}
