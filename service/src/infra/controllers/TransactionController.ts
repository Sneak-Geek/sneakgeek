// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { controller, httpGet, request, response, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { Transaction, TrackingStatusEnum as TrackingStatus } from "../database";
import { Types } from "../../configuration/inversify";
import { Request, Response } from "express";
import { query, body } from "express-validator";
import {
  ValidationPassedMiddleware,
  AccountVerifiedMiddleware,
  FirebaseAuthMiddleware,
  AuthenticatorPermissionMiddleware,
} from "../middlewares";
import { IPaymentService } from "../services";
import mongoose from "mongoose";
import HttpStatus from "http-status";
import { PaymentStatus, PaymentCallbackResponse } from "../../assets/constants";
import { ITransactionDao, INotificationDao, IProfileDao } from "../dao";

@controller("/api/v1/transaction")
export class TransactionController {
  @inject(Types.PaymentService)
  private readonly paymentService!: IPaymentService;

  @inject(Types.TransactionDao)
  private readonly transactionDao!: ITransactionDao;

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
    FirebaseAuthMiddleware,
    AccountVerifiedMiddleware
  )
  public async getPendingAuthenticationTransaction(@response() res: Response) {
    const pendingAuthenticationTransaction = await this.transactionDao.findPendingAuthentication();
    return res.status(HttpStatus.OK).send({ pendingAuthenticationTransaction });
  }

  @httpPut(
    "/update-authentication-status",
    FirebaseAuthMiddleware,
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

  private _getLatestTrackingStatus(transaction: Transaction): TrackingStatus {
    const { trackingStatusHistory } = transaction.tracking;
    return trackingStatusHistory[trackingStatusHistory.length - 1].status;
  }
}
