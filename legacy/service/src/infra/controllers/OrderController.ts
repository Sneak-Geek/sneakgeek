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
  requestBody,
  httpPost,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify/inversify.types";
import {
  ValidationPassedMiddleware,
  AuthMiddleware,
  AccountVerifiedMiddleware,
  AdminPermissionMiddleware,
} from "../middlewares";
import {
  OrderStatus,
  PaymentCallbackResponse,
  PaymentMethod,
} from "../../assets/constants";
import { IPaymentService } from "../services";
import { IOrderDao, IInventoryDao, IShoeDao } from "../dao";
import { UserAccount } from "../database";
import mongoose from "mongoose";

@controller("/api/v1/order")
export class OrderController {
  @inject(Types.InventoryDao)
  private readonly inventoryDao!: IInventoryDao;

  @inject(Types.OrderDao)
  private readonly orderDao!: IOrderDao;

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

  @httpPost(
    "/bank-transfer",
    body("paymentType").isIn(Object.keys(PaymentMethod)),
    body("inventoryId").isMongoId(),
    body("addressLine1").isString(),
    body("addressLine2").optional().isString(),
    body("sellingPrice").isInt(),
    AuthMiddleware,
    AccountVerifiedMiddleware,
    ValidationPassedMiddleware
  )
  public async bankTransfer(@request() req: Request, @response() res: Response) {
    // Update inventory and create order
    // TO DO: Implement transactions with isolation and atomicity. Ref: https://docs.mongodb.com/manual/core/transactions/
    const { paymentType, inventoryId, addressLine1, addressLine2, sellingPrice } = req.body;
    const user = req.user as UserAccount;
    const updatedInventory = await this.inventoryDao.updateInventoryWhenCreateOrder(
      inventoryId as string
    );

    if (!updatedInventory) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Out of stock!" });
    }

    const newOrder = {
      buyerId: (user.profile as unknown) as string,
      inventoryId: (inventoryId as unknown) as string,
      shoeId: (updatedInventory.shoeId as unknown) as string,
      shippingAddress: {
        addressLine1: (addressLine1 as unknown) as string,
        addressLine2: (addressLine2 as unknown) as string,
      },
      sellingPrice: (sellingPrice as unknown) as number,
      paymentMethod: (paymentType as unknown) as PaymentMethod,
    };

    const order = await this.orderDao.create(newOrder);

    return res.status(HttpStatus.OK).send(order);
  }

  @httpPost("/update-admin", 
  body("statusUpdate").isString(),
  body("orderId").isMongoId(),
  AuthMiddleware,
  AccountVerifiedMiddleware,
  AdminPermissionMiddleware,
  ValidationPassedMiddleware
  )
  public async updateOrderByAdmin(@request() req: Request, @response() res: Response) {
    try {

      const {orderId} = req.body;
      const order = await this.orderDao.findById(orderId);
      
      if (order.trackingStatus))


    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }
}
