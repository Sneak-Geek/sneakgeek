// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Request, Response } from "express";
import { body, query, param } from "express-validator";
import HttpStatus from "http-status";
import { inject } from "inversify";
import {
  controller,
  httpPost,
  request,
  response,
  httpPatch,
  httpGet,
  queryParam,
  httpPut,
  requestParam,
} from "inversify-express-utils";
import { SellOrder, UserProfile, BuyOrder, Transaction } from "../database";
import { Types } from "../../configuration/inversify/inversify.types";
import {
  ValidationPassedMiddleware,
  AuthMiddleware,
  AccountVerifiedMiddleware,
  AdminPermissionMiddleware,
} from "../middlewares";
import { ShoeSize, ShoeBoxCondition } from "../../assets/settings";
import mongoose from "mongoose";
import { OrderStatus, OrderType } from "../../assets/constants";
import { IShippingService, IPaymentService, NotificationType } from "../services";
import {
  ISellOrderDao,
  IBuyOrderDao,
  ITransactionDao,
  IProfileDao,
  INotificationDao,
} from "../dao";
import { ObjectId } from "mongodb";

@controller("/api/v1/order", AuthMiddleware, AccountVerifiedMiddleware)
export class OrderController {
  @inject(Types.ProfileDao)
  private readonly profileDao!: IProfileDao;

  @inject(Types.ShippingService)
  private readonly shippingService!: IShippingService;

  @inject(Types.PaymentService)
  private readonly paymentService!: IPaymentService;

  @inject(Types.NotificationDao)
  private readonly notificationDao!: INotificationDao;

  @inject(Types.SellOrderDao)
  private readonly sellOrderDao!: ISellOrderDao;

  @inject(Types.BuyOrderDao)
  private readonly buyOrderDao!: IBuyOrderDao;

  @inject(Types.TransactionDao)
  private readonly transactionDao!: ITransactionDao;

  @httpPost(
    "/sell-order/new",
    body("shoeId").isMongoId(),
    body("shoeSize").isIn(ShoeSize.Adult),
    body("sellPrice").isNumeric(),
    ValidationPassedMiddleware
  )
  public async createSellOrderNewShoe(@request() req: Request, @response() res: Response) {
    req.body.sellerId = req.user.profile;
    const createdSellOrder = await this.sellOrderDao.createSellOrderNewShoe(req.body);
    return res.status(HttpStatus.CREATED).send({
      message: "Create sell order for new shoe success!",
      createdSellOrder,
    });
  }

  @httpPost(
    "/sell-order/used",
    body("shoeId").isMongoId(),
    body("shoeSize").isIn(ShoeSize.Adult),
    body("sellPrice").isNumeric(),
    body("productCondition").exists(),
    body("productCondition.boxCondition").optional().isString().isIn(ShoeBoxCondition),
    body("productCondition.isTainted").optional().isBoolean(),
    body("productCondition.isOutsoleWorn").optional().isBoolean(),
    body("productCondition.otherDetail").optional().isString().isLength({ max: 140 }),
    body("pictures").isArray(), // TODO: define min length
    body("pictures[*]").optional().isString()
  )
  public async createSellOrderUsedShoe(@request() req: Request, @response() res: Response) {
    req.body.sellerId = req.user.profile;
    const createdSellOrder = await this.sellOrderDao.createSellOrderUsedShoe(req.body);
    return res.status(HttpStatus.CREATED).send({
      message: "Create sell order for used shoe success!",
      createdSellOrder,
    });
  }

  @httpPost(
    "/buy-order/new",
    body("buyPrice").isNumeric(),
    body("shoeId").isMongoId(),
    body("shoeSize").isIn(ShoeSize.Adult),
    ValidationPassedMiddleware
  )
  public async createBuyOrderNewShoe(@request() req: Request, @response() res: Response) {
    req.body.buyerId = req.user.profile;
    const createdBuyOrder = await this.buyOrderDao.createBuyOrderNewShoe(req.body);
    return res.status(HttpStatus.CREATED).send({
      message: "Create buy order success!",
      createdBuyOrder,
    });
  }

  @httpPost(
    "/buy-order/used",
    body("shoeId").isMongoId(),
    body("shoeSize").isIn(ShoeSize.Adult),
    body("buyPrice").isNumeric(),
    body("sellOrderId").isMongoId()
  )
  public async createBuyOrderUsedShoe(@request() req: Request, @response() res: Response) {
    req.body.buyerId = req.user.profile;
    const createdBuyOrder = await this.buyOrderDao.createBuyOrderUsedShoe(req.body);
    return res.status(HttpStatus.CREATED).send({
      message: "Create buy order success!",
      createdBuyOrder,
    });
  }

  @httpGet("/sell-order/all", AdminPermissionMiddleware)
  public async getAllSellOrders(@request() req: Request, @response() res: Response) {
    try {
      const allSellOrders = await this.sellOrderDao.findAll();
      return res.status(HttpStatus.OK).send(allSellOrders);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpGet("/buy-order/all", AdminPermissionMiddleware)
  public async getAllBuyOrders(@request() req: Request, @response() res: Response) {
    try {
      const allBuyOrders = await this.buyOrderDao.findAll();
      return res.status(HttpStatus.OK).send(allBuyOrders);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpPatch(
    "/buy-order/set-status",
    AdminPermissionMiddleware,
    body("buyOrderId").isMongoId(),
    body("buyOrderStatus").isIn(Object.keys(OrderStatus)),
    ValidationPassedMiddleware
  )
  public async setBuyOrderStatus(@request() req: Request, @response() res: Response) {
    const updatedBuyOrder = await this.buyOrderDao.updateStatusById(
      req.body.buyOrderId,
      req.body.buyOrderStatus
    );

    if (!updatedBuyOrder) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Buy order not found!",
      });
    } else {
      return res.status(HttpStatus.OK).send({
        message: "Set buy order status success!",
        updatedBuyOrder,
      });
    }
  }

  @httpPatch(
    "/sell-order/set-status",
    AdminPermissionMiddleware,
    body("sellOrder").isMongoId(),
    body("sellOrderStatus").isIn(Object.keys(OrderStatus)),
    ValidationPassedMiddleware
  )
  public async setSellOrderStatus(@request() req: Request, @response() res: Response) {
    const updatedSellOrder = await this.sellOrderDao.updateStatusById(
      req.body.sellOrder,
      req.body.sellOrderStatus
    );

    if (!updatedSellOrder) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Sell order not found!",
      });
    } else {
      return res.status(HttpStatus.OK).send({
        message: "Set sell order status success!",
        updatedSellOrder,
      });
    }
  }

  @httpGet("/get-total-fee", query("sellOrderId").isMongoId(), ValidationPassedMiddleware)
  public async getTotalFee(@request() req: Request, @response() res: Response) {
    const sellOrderId = req.query.sellOrderId as string;
    const populatedSellOrder = await this.sellOrderDao.findByIdAndPopulate(sellOrderId);
    if (!populatedSellOrder) {
      return res.status(HttpStatus.NOT_FOUND).send({ message: "Sell order not found!" });
    }

    const buyerProfile = await this.profileDao.findById(req.user.profile);
    const sellerProfile = populatedSellOrder.seller;
    if (!buyerProfile || !sellerProfile) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "User profile not found!",
      });
    }

    const shippingFee = await this.shippingService.getEstimatedTotalShippingFee(
      buyerProfile,
      sellerProfile
    );

    return res.status(HttpStatus.OK).send({
      shippingFee,
      shoePrice: populatedSellOrder.sellPrice,
    });
  }

  @httpGet(
    "/lowest-sell-order-and-highest-buy-order",
    query("shoeId").isMongoId(),
    query("shoeSize").isString().isIn(ShoeSize.Adult),
    ValidationPassedMiddleware
  )
  public async getLowestSellOrderAndHighestBuyOrder(
    @queryParam("shoeId") shoeId: string,
    @queryParam("shoeSize") shoeSize: string,
    @response() res: Response
  ) {
    const [lowestSellOrder, highestBuyOrder] = await Promise.all([
      this.sellOrderDao.findLowestSellOrderByShoeIdAndShoeSize(shoeId, shoeSize),
      this.buyOrderDao.findHighestBuyOrderByShoeIdAndShoeSize(shoeId, shoeSize),
    ]);
    return res.status(HttpStatus.OK).send({
      lowestSellOrder,
      highestBuyOrder,
    });
  }

  @httpGet(
    "/pay",
    query("paymentType").isIn(["intl", "domestic"]),
    query("buyOrderId").optional().isMongoId(),
    query("sellOrderId").isMongoId(),
    ValidationPassedMiddleware
  )
  public async buyShoe(@request() req: Request, @response() res: Response) {
    const buyOrderId = req.query.buyOrderId as string;
    const sellOrderId = req.query.sellOrderId as string;
    const paymentType = req.query.paymentType as "intl" | "domestic";

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sellOrder = await this.sellOrderDao.findById(sellOrderId);
      const buyOrder = buyOrderId
        ? await this.buyOrderDao.findById(buyOrderId)
        : await this.buyOrderDao.createBuyOrderFromSellOrder(req.user.profile, sellOrder);

      if (
        !sellOrder ||
        !buyOrder ||
        sellOrder.status !== OrderStatus.APPROVED ||
        sellOrder.status !== OrderStatus.APPROVED
      ) {
        await session.abortTransaction();
        return res.status(HttpStatus.NOT_FOUND).send({ message: "Cannot find order" });
      }

      const { buyerProfile, sellerProfile } = await this._getBuyerAndSellerProfile(
        buyOrder.buyerId,
        sellOrder.sellerId
      );
      const {
        estimatedShippingFeeFromSellerToSnkg,
        estimatedShippingFeeFromSnkgToBuyer,
      } = await this._getEstimatedShippingFee(sellerProfile, buyerProfile);

      const newTransaction = await this.transactionDao.create({
        sellOrderId: sellOrder._id,
        buyOrderId: buyOrder._id,
        feeBreakdown: {
          productPrice: sellOrder.sellPrice,
          estimatedShippingFeeFromSellerToSnkg,
          estimatedShippingFeeFromSnkgToBuyer,
        },
      });

      const { shoe } = await this.sellOrderDao.populate(sellOrder);
      const totalFee =
        estimatedShippingFeeFromSellerToSnkg +
        estimatedShippingFeeFromSnkgToBuyer +
        sellOrder.sellPrice;
      const onepayRedirectUrl = this.paymentService.generateRedirectUrl(
        paymentType,
        shoe.title,
        newTransaction._id.toString(),
        totalFee.toString(),
        `${req.protocol}://${req.headers.host}`
      );

      await session.commitTransaction();
      return res.status(HttpStatus.OK).send(onepayRedirectUrl);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  @httpGet(
    "/",
    query("orderType").isIn(["BuyOrder", "SellOrder"]),
    ValidationPassedMiddleware
  )
  public async getUserOrders(@request() req: Request, @response() res: Response) {
    const orderType = req.query.orderType as string;
    const profileId = req.user.profile;
    const orders =
      orderType === "BuyOrder"
        ? await this.buyOrderDao.findByBuyerIdAndPopulate(profileId)
        : await this.sellOrderDao.findBySellerIdAndPopulate(profileId);
    return res.status(HttpStatus.OK).send({ orders });
  }

  @httpPatch("/sell-order/cancel", query("orderId").isMongoId(), ValidationPassedMiddleware)
  public async cancelSellOrder(
    @queryParam("orderId") orderId: string,
    @response() res: Response
  ) {
    const updatedSellOrder = await this.sellOrderDao.cancelSellOrder(orderId);
    return res.status(HttpStatus.OK).send({ updatedSellOrder });
  }

  @httpPut(
    "/sell-order/update",
    body("orderId").isMongoId(),
    body("sellPrice").optional().isNumeric(),
    body("productCondition").optional(),
    body("productCondition.boxCondition").optional().isString().isIn(ShoeBoxCondition),
    body("productCondition.isTainted").optional().isBoolean(),
    body("productCondition.isOutsoleWorn").optional().isBoolean(),
    body("productCondition.otherDetail").optional().isString().isLength({ max: 140 }),
    ValidationPassedMiddleware
  )
  public async updateSellOrder(@request() req: Request, @response() res: Response) {
    const sellOrder = await this.sellOrderDao.findByIdAndPopulate(req.body.orderId);

    if (
      sellOrder.status === OrderStatus.COMPLETED ||
      sellOrder.status === OrderStatus.DENIED
    ) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: "Your edit request is unauthorized",
      });
    }

    const updatedSellOrder = await this.sellOrderDao.updateSellOrder(req.body);
    if (!updatedSellOrder) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Sell order not found",
      });
    } else {
      if (req.body.sellNowPrice) {
        this._notifyBuyersOnSellPriceUpdate(updatedSellOrder);
      }
      return res.status(HttpStatus.OK).send({
        updatedSellOrder,
      });
    }
  }

  @httpGet("/sell-order/:orderId", param("orderId").isMongoId(), ValidationPassedMiddleware)
  public async findPopulatedSellOrderById(
    @request() req: Request,
    @requestParam("orderId") orderId: string,
    @response() res: Response
  ) {
    const populatedSellOrder = await this.sellOrderDao.findByIdAndPopulate(orderId);
    if (!(populatedSellOrder.sellerId as ObjectId).equals(req.user.profile)) {
      return res.status(HttpStatus.UNAUTHORIZED).send({
        message: "Unauthorized",
      });
    }

    return res.status(HttpStatus.OK).send(populatedSellOrder);
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

  private async _notifyBuyersOnSellPriceUpdate(sellOrder: SellOrder) {
    const matchingBuyOrders = await this.buyOrderDao.findMatchingPriceBuyOrderWithBuyer(
      sellOrder
    );

    const populatedSellOrder = await this.sellOrderDao.populate(sellOrder);
    const shoeName = populatedSellOrder.shoe.title;
    const price = populatedSellOrder.sellPrice;

    return Promise.all(
      matchingBuyOrders.map(async (buyOrder) => {
        this.notificationDao.createNotification({
          profileId: buyOrder.buyerId as ObjectId,
          orderId: buyOrder._id,
          orderType: "BuyOrder",
          notificationType: NotificationType.SELL_ORDER_PRICE_UPDATE,
          title: "Người bán cập nhật giá",
          body: `Giá bán cho đôi ${shoeName} được cập nhật với mức giá mới ${price}`,
        });
      })
    );
  }

  private async _getBuyerAndSellerProfile(
    buyerId: ObjectId,
    sellerId: ObjectId
  ): Promise<{ buyerProfile: UserProfile; sellerProfile: UserProfile }> {
    const [buyerProfile, sellerProfile] = await Promise.all([
      this.profileDao.findById(buyerId),
      this.profileDao.findById(sellerId),
    ]);
    return { buyerProfile, sellerProfile };
  }

  private async _getEstimatedShippingFee(
    sellerProfile: UserProfile,
    buyerProfile: UserProfile
  ): Promise<{
    estimatedShippingFeeFromSellerToSnkg: number;
    estimatedShippingFeeFromSnkgToBuyer: number;
  }> {
    const [
      estimatedShippingFeeFromSellerToSnkg,
      estimatedShippingFeeFromSnkgToBuyer,
    ] = await Promise.all([
      this.shippingService.getEstimatedShippingFeeFromSenderToSnkg(sellerProfile),
      this.shippingService.getEstimatedShippingFeeFromSnkgToReceiver(buyerProfile),
    ]);
    return {
      estimatedShippingFeeFromSellerToSnkg,
      estimatedShippingFeeFromSnkgToBuyer,
    };
  }
}
