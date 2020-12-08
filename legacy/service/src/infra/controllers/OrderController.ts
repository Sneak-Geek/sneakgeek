// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Request, Response } from "express";
import { query } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  request,
  response,
  httpGet,
  queryParam,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify/inversify.types";
import {
  ValidationPassedMiddleware,
  AuthMiddleware,
  AccountVerifiedMiddleware,
} from "../middlewares";
import { OrderStatus, OrderType, PaymentCallbackResponse } from "../../assets/constants";
import { IPaymentService } from "../services";
import { IOrderDao, IInventoryDao } from "../dao";

@controller("/api/v1/order")
export class OrderController {
  @inject(Types.PaymentService)
  private readonly paymentService!: IPaymentService;

  @inject(Types.SellOrderDao)
  private readonly inventoryDao!: IInventoryDao;

  @inject(Types.OrderDao)
  private readonly orderDao!: IOrderDao;

  @httpGet(
    "/payment",
    query("paymentType").isIn(["intl", "domestic"]),
    query("inventoryId").isMongoId(),
    AuthMiddleware,
    AccountVerifiedMiddleware,
    ValidationPassedMiddleware
  )
  public async getPaymentUrl(@request() req: Request, @response() res: Response) {
    const { paymentType, inventoryId } = req.query;
    const buyerId = req.user._id;
    const [inventory, order] = await Promise.all([
      this.inventoryDao.findById(inventoryId as string),
      this.orderDao.create({ buyerId, inventoryId: inventoryId as string }),
    ]);
    const onepayRedirectUrl = this.paymentService.generateRedirectUrl(
      paymentType as string,
      order.id,
      inventory.sellPrice.toString(),
      `${req.protocol}://${req.headers.host}`
    );
    return res.status(HttpStatus.OK).send(onepayRedirectUrl);
  }

  @httpGet(
    "/payment/callback",
    query("paymentType").isIn(["intl", "domestic"]),
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

  @httpGet(
    "/shoe-price-size-map",
    query("orderType").isIn(["SellOrder", "BuyOrder"]),
    query("shoeId").isMongoId(),
    ValidationPassedMiddleware
  )
  public async getShoePriceSizeMap(
    @queryParam("orderType") orderType: OrderType,
    @queryParam("shoeId") shoeId: string,
    @response() res: Response
  ) {
    const results =
      orderType === "SellOrder"
        ? await this.sellOrderDao.findLowestSellPriceSizeMap(shoeId)
        : await this.buyOrderDao.findHighestBuyPriceSizeMap(shoeId);

    return res.status(HttpStatus.OK).send(results);
  }
}
