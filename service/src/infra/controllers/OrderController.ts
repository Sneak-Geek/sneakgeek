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
  httpPut,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify";
import {
  ValidationPassedMiddleware,
  FirebaseAuthMiddleware,
  AccountVerifiedMiddleware,
} from "../middlewares";
import { PaymentMethod, TrackingStatus } from "../../assets/constants";
import { IOrderDao } from "../dao";
import { UserProfile } from "../database";
import { AsbtractOrderController } from "./AbstractOrderController";

@controller("/api/v1/order")
export class OrderController extends AsbtractOrderController {
  constructor(
    @inject(Types.OrderDao)
    private readonly orderDao: IOrderDao
  ) {
    super();
  }

  @httpGet("/", FirebaseAuthMiddleware, AccountVerifiedMiddleware)
  public async getOrderHistory(@request() req: Request, @response() res: Response) {
    const user = req.user as UserProfile;
    const profileId = req.user.id;

    const orders = await this.orderDao.getUserHistory(profileId, user.isSeller);
    return res.status(HttpStatus.OK).send(orders);
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
    body("soldPrice").isInt(),
    body("shoeId").optional(),
    FirebaseAuthMiddleware,
    AccountVerifiedMiddleware,
    ValidationPassedMiddleware
  )
  public async bankTransfer(@request() req: Request, @response() res: Response) {
    // Update inventory and create order
    // TO DO: Implement transactions with isolation and atomicity. Ref: https://docs.mongodb.com/manual/core/transactions/
    const {
      paymentType,
      shoeId,
      addressLine1,
      addressLine2,
      soldPrice,
      inventoryId,
    } = req.body;
    // Bank transfer needs shoeId, soldPrice to find corresponding inventory
    // const inventory = await this.inventoryDao.getMatchingInventory(
    //   shoeId,
    //   parseInt(soldPrice, 10)
    // );

    const user = req.user as UserProfile;
    const updatedInventory = await this.inventoryDao.updateInventoryWhenCreateOrder(
      inventoryId
    );

    if (!updatedInventory) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: "Out of stock!" });
    }

    let trackingStatus = [];
    trackingStatus.push({
      status: TrackingStatus.WAITING_FOR_BANK_TRANSFER,
      date: Date.now(),
    });

    const newOrder = {
      buyerId: (user?._id as unknown) as string,
      sellerId: updatedInventory.sellerId,
      inventoryId: (inventoryId as unknown) as string,
      shoeId: (updatedInventory.shoeId as unknown) as string,
      shippingAddress: {
        addressLine1: (addressLine1 as unknown) as string,
        addressLine2: (addressLine2 as unknown) as string,
      },
      soldPrice: (soldPrice as unknown) as number,
      paymentMethod: (paymentType as unknown) as PaymentMethod,
      trackingStatus,
    };

    const order = await this.orderDao.create(newOrder);

    return res.status(HttpStatus.OK).send(order);
  }

  @httpPut(
    "/update-seller",
    body("status").isIn([
      TrackingStatus.SELLER_APPROVED_ORDER,
      TrackingStatus.SELLER_REJECTED_ORDER,
    ]),
    body("orderId").isMongoId(),
    FirebaseAuthMiddleware,
    Types.IsSellerMiddleware,
    ValidationPassedMiddleware
  )
  public async updateOrderBySeller(@request() req: Request, @response() res: Response) {
    try {
      const { orderId, status } = req.body;
      const order = await this.orderDao.updateTrackingAndOrderStatus(orderId, status);
      if (!order) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: "Bad request!" });
      }

      await this.notifyByEmail(order, status);

      return order;
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }
}
