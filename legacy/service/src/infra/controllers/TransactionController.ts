// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import {
  controller,
  httpGet,
  request,
  response,
  httpPut,
  httpPost,
} from "inversify-express-utils";
import { inject } from "inversify";
import {
  Transaction,
  TrackingStatusEnum as TrackingStatus,
  GhnFailureCode,
} from "../database";
import { Types } from "../../configuration/inversify";
import { Request, Response } from "express";
import { query, body } from "express-validator";
import {
  ValidationPassedMiddleware,
  AccountVerifiedMiddleware,
  AuthMiddleware,
  AuthenticatorPermissionMiddleware,
} from "../middlewares";
import {
  IPaymentService,
  IShippingService,
  GhnWebhookCallbackDataType,
  NotificationType,
} from "../services";
import mongoose from "mongoose";
import HttpStatus from "http-status";
import { AdminProfile } from "../../assets/seeds/user";
import { ObjectId } from "mongodb";
import {
  PaymentStatus,
  PaymentCallbackResponse,
} from "../../assets/constants";
import { ITransactionDao, INotificationDao, IProfileDao } from "../dao";
import { LogProvider } from "../providers";

@controller("/api/v1/transaction")
export class TransactionController {
  @inject(Types.ProfileDao)
  private readonly profileDao!: IProfileDao;

  @inject(Types.PaymentService)
  private readonly paymentService!: IPaymentService;

  @inject(Types.ShippingService)
  private readonly shippingService!: IShippingService;

  @inject(Types.TransactionDao)
  private readonly transactionDao!: ITransactionDao;

  @inject(Types.NotificationDao)
  private readonly notificationDao!: INotificationDao;

  @httpGet(
    "/payment-callback",
    query("paymentType").isIn(["intl", "domestic"]),
    query("vpc_TxnResponseCode").isNumeric(),
    query("vpc_SecureHash").isString(),
    query("vpc_MerchTxnRef").isMongoId(), // transactionId
    query("vpc_OrderInfo").isString().optional(),
    query("vpc_Amount").isString(),
    query("vpc_Message").isString().optional(),
    ValidationPassedMiddleware
  )
  public async paymentServiceCallback(@request() req: Request, @response() res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transactionId = req.query["vpc_MerchTxnRef"] as string;
      const transaction = await this.transactionDao.findById(transactionId);

      if (!this._verifyPaymentCallbackStatus(req.query)) {
        // payment failed
        await this.transactionDao.updatePaymentStatus(transaction._id, {
          status: PaymentStatus.CANCELED,
          message: req.query["vpc_Message"] as string,
        });
        await session.commitTransaction();
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send(PaymentCallbackResponse.Failure);
      } else {
        // payment succeed
      }

      try {
      } catch (error) {
        // can't send notification
      }

      // create shipping order from seller to Sneakgeek

      return res.status(HttpStatus.OK).send(PaymentCallbackResponse.Success);
    } catch (error) {
      await session.abortTransaction();
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(PaymentCallbackResponse.Failure);
    } finally {
      session.endSession();
    }
  }

  @httpGet(
    "/pending-authentication-transactions",
    AuthMiddleware,
    AccountVerifiedMiddleware
  )
  public async getPendingAuthenticationTransaction(@response() res: Response) {
    const pendingAuthenticationTransaction = await this.transactionDao.findPendingAuthentication();
    return res.status(HttpStatus.OK).send({ pendingAuthenticationTransaction });
  }

  @httpPut(
    "/update-authentication-status",
    AuthMiddleware,
    AccountVerifiedMiddleware,
    AuthenticatorPermissionMiddleware,
    body("transactionId").exists().isMongoId(),
    body("authenticationStatus")
      .exists()
      .isIn([TrackingStatus.APPROVED_BY_SNEAKGEEK, TrackingStatus.REJECTED_BY_SNEAKGEEK]),
    body("description").optional().isString(),
    ValidationPassedMiddleware
  )
  public async updateAuthenticationStatus(
    @request() req: Request,
    @response() res: Response
  ) {
    const transaction = await this.transactionDao.findById(req.body.transactionId);
    const latestStatus = this._getLatestTrackingStatus(transaction);
    if (latestStatus !== TrackingStatus.DELIVERED_TO_SNEAKGEEK) {
      return res.status(HttpStatus.NOT_FOUND).send({
        message: "Document doesn't exist or has already been udpated!",
      });
    } else {
      await this.transactionDao.updateAuthenticationStatus(
        req.body.transactionId,
        req.body.authenticationStatus,
        req.body.description
      );
      return res
        .status(HttpStatus.OK)
        .send({ message: "Successfully updated transaction status!" });
    }
  }

  @httpPost("/ghnCallback")
  public async onGhnHookCallback(@request() req: Request, @response() res: Response) {
    const body = req.body as GhnWebhookCallbackDataType;

    LogProvider.instance.info("GHN webhook callback", JSON.stringify(body));

    const transactionId = body.ExternalCode;
    const description = body.Note;
    const transaction = await this.transactionDao.findById(transactionId);
    const isDeliveringFromSeller =
      body.OrderCode === transaction.tracking.ghnDeliverFromSellerCode;
    let status = "";
    let failureCode = undefined;

    switch (body.CurrentStatus) {
      case "Picking":
        status = isDeliveringFromSeller
          ? TrackingStatus.PENDING_PICKUP_FROM_SELLER
          : TrackingStatus.PENDING_PICKUP_FROM_SNEAKGEEK;
        break;
      case "Delivering":
        status = isDeliveringFromSeller
          ? TrackingStatus.DELIVERING_TO_SNEAKGEEK
          : TrackingStatus.DELIVERING_TO_BUYER;
        break;
      case "Delivered":
        status = isDeliveringFromSeller
          ? TrackingStatus.DELIVERED_TO_SNEAKGEEK
          : TrackingStatus.DELIVERED_TO_BUYER;
        break;
      case "Cancel":
      case "LostOrder":
        status = TrackingStatus.DELIVER_FAILED;
        failureCode =
          body.CurrentStatus === "Cancel"
            ? GhnFailureCode.ORDER_CANCELED
            : GhnFailureCode.ORDER_LOST;
        break;
      default:
        break;
    }

    this.transactionDao.updateTrackingStatusByTransactionId(
      transactionId,
      status,
      description,
      failureCode
    );
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

  private async _createShippingOrderFromSellerToSnkg(
    transactionId: string,
    sellerId: ObjectId
  ): Promise<any> {
    const sellerProfile = await this.profileDao.findById(sellerId);
    return await this.shippingService.createShippingOrder(
      transactionId,
      sellerProfile,
      AdminProfile
    );
  }

  private _getLatestTrackingStatus(transaction: Transaction): TrackingStatus {
    const { trackingStatusHistory } = transaction.tracking;
    return trackingStatusHistory[trackingStatusHistory.length - 1].status;
  }
}
