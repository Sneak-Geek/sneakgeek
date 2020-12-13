// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Request, Response } from "express";
import { body, query } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  request,
  response,
  httpGet,
  queryParam,
  httpPost,
  requestBody,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify/inversify.types";
import {
  ValidationPassedMiddleware,
  AuthMiddleware,
  AccountVerifiedMiddleware,
} from "../middlewares";
import { OrderStatus, PaymentCallbackResponse } from "../../assets/constants";
import { IPaymentService } from "../services";
import { IOrderDao, IInventoryDao, IShoeDao } from "../dao";
import { UserAccount } from "../database";
import mongoose from "mongoose";

@controller("/api/v1/order")
export class OrderController {
  @inject(Types.PaymentService)
  private readonly paymentService!: IPaymentService;

  @inject(Types.InventoryDao)
  private readonly inventoryDao!: IInventoryDao;

  @inject(Types.OrderDao)
  private readonly orderDao!: IOrderDao;

  @inject(Types.ShoeDao)
  private readonly shoeDao!: IShoeDao;

  @httpGet("/", AuthMiddleware, AccountVerifiedMiddleware, ValidationPassedMiddleware)
  public async getOrderHistoryByUserId(
    @request() req: Request,
    @requestBody() body: any,
    @response() res: Response
  ) {
    const user = req.user as UserAccount;
    const buyerId = (user.profile as mongoose.Types.ObjectId).toHexString();
    const order = await this.orderDao.getOrderHistoryByUserId(buyerId);
    return res.status(HttpStatus.OK).send(order);
  }

  @httpPost(
    "/new",
    AuthMiddleware,
    AccountVerifiedMiddleware,
    body("inventoryId").isMongoId(),
    ValidationPassedMiddleware
  )
  public async newOrder(
    @request() req: Request,
    @requestBody() body: any,
    @response() res: Response
  ) {
    const user = req.user as UserAccount;
    const order = await this.orderDao.create({
      buyerId: (user.profile as mongoose.Types.ObjectId).toHexString(),
      inventoryId: body.inventoryId,
    });

    return res.status(HttpStatus.OK).send(order);
  }

  @httpGet(
    "/pay",
    query("paymentType").isIn(["intl", "domestic"]),
    query("inventoryId").isMongoId(),
    AuthMiddleware,
    AccountVerifiedMiddleware,
    ValidationPassedMiddleware
  )
  public async getPaymentUrl(@request() req: Request, @response() res: Response) {
    const { paymentType, inventoryId } = req.query;
    const user = req.user as UserAccount;
    const buyerId = (user.profile as mongoose.Types.ObjectId).toHexString();

    const [inventory, order] = await Promise.all([
      this.inventoryDao.findById(inventoryId as string),
      this.orderDao.create({ buyerId, inventoryId: inventoryId as string }),
    ]);
    const shoe = await this.shoeDao.findById(inventory.shoeId);

    const onepayRedirectUrl = this.paymentService.generateRedirectUrl(
      paymentType as string,
      order.id,
      inventory.sellPrice.toString(),
      `${req.protocol}://${req.headers.host}`,
      shoe
    );
    console.log("Onepay payment url", onepayRedirectUrl);
    return res.status(HttpStatus.OK).send(onepayRedirectUrl);
  }

  @httpGet(
    "/payment-callback/",
    query("vpc_TxnResponseCode").isNumeric(),
    query("vpc_SecureHash").isString(),
    query("vpc_MerchTxnRef").isMongoId(), // orderId
    query("vpc_OrderInfo").isString().optional(), // orderId
    query("vpc_Amount").isString(),
    query("vpc_Message").isString().optional(),
    ValidationPassedMiddleware
  )
  public async paymentCallback(@request() req: Request, @response() res: Response) {
    const orderId = req.query["vpc_MerchTxnRef"] as string;
    if (!this._verifyPaymentCallbackStatus(req.query)) {
      await this.orderDao.updateStatus(orderId, OrderStatus.FAILED);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(PaymentCallbackResponse.Failure);
    } else {
      const inventoryId = (await this.orderDao.findById(orderId)).inventoryId.toHexString();
      await Promise.all([
        this.orderDao.updateStatus(orderId, OrderStatus.COMPLETED),
        this.inventoryDao.reduceByOne(inventoryId),
      ]);
      return res.status(HttpStatus.OK).send(PaymentCallbackResponse.Success);
    }
  }

  private _verifyPaymentCallbackStatus(query: any): boolean {
    const paymentType = query["paymentType"] as "intl" | "domestic";
    const onepayResponseCode = query["vpc_TxnResponseCode"] as string;
    const secureHash = query["vpc_SecureHash"] as string;

    const copiedQuery = Object.assign({}, query);
    delete copiedQuery["vpc_SecureHash"];

    return (
      onepayResponseCode === "0" &&
      secureHash === this.paymentService.hashParams(paymentType, copiedQuery)
    );
  }

  @httpGet("/shoe-price-size-map", query("shoeId").isMongoId(), ValidationPassedMiddleware)
  public async getShoePriceSizeMap(
    @queryParam("shoeId") shoeId: string,
    @response() res: Response
  ) {
    const result = await this.inventoryDao.getPriceBySize(shoeId);

    return res.status(HttpStatus.OK).send(result);
  }

  @httpGet("/last-sold", query("count").isInt({ min: 1 }))
  public async getLastSold(@queryParam("count") count: string, @response() res: Response) {
    const top = await this.orderDao.getLastSold(parseInt(count, 10));

    return res.status(HttpStatus.OK).send(top);
  }
}
