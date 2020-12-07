// !
// ! Copyright (c) 2020 - SneakGeek. All rights reserved
// !

import { ITransactionDao, TransactionCreateInput } from "./ITransactionDao";
import { injectable, inject } from "inversify";
import { Types } from "../../../configuration/inversify";
import {
  Repository,
  Transaction,
  TrackingStatusEnum as TrackingStatus,
} from "../../database";
import { PaymentStatus } from "../../../assets/constants";
import { ObjectId } from "mongodb";

@injectable()
export class TransactionDao implements ITransactionDao {
  @inject(Types.TransactionRepository)
  private readonly transactionRepo!: Repository<Transaction>;

  public async create(input: TransactionCreateInput): Promise<Transaction> {
    return await this.transactionRepo.create({
      paymentStatus: { status: PaymentStatus.PENDING },
      sellOrderId: input.sellOrderId,
      buyOrderId: input.buyOrderId,
      "feeBreakdown.productPrice": input.feeBreakdown.productPrice,
      "feeBreakdown.estimatedShippingFeeFromSellerToSnkg":
        input.feeBreakdown.estimatedShippingFeeFromSellerToSnkg,
      "feeBreakdown.estimatedShippingFeeFromSnkgToBuyer":
        input.feeBreakdown.estimatedShippingFeeFromSnkgToBuyer,
    });
  }

  public async findPendingAuthentication(): Promise<Transaction[]> {
    return await this.transactionRepo
      .aggregate([
        {
          $project: {
            feeBreakdown: 1,
            paymentStatus: 1,
            sellOrder: 1,
            buyOrder: 1,
            tracking: 1,
            latestTrackingStatus: {
              $arrayElemAt: ["$tracking.trackingStatusHistory", -1],
            },
          },
        },
        {
          $match: {
            "latestTrackingStatus.status": TrackingStatus.DELIVERED_TO_SNEAKGEEK,
          },
        },
        {
          $lookup: {
            from: "sellorders",
            localField: "sellOrder",
            foreignField: "_id",
            as: "sellOrder",
          },
        },
        {
          $unwind: "$sellOrder",
        },
        {
          $lookup: {
            from: "shoes",
            localField: "sellOrder.shoeId",
            foreignField: "_id",
            as: "sellOrder.product",
          },
        },
        {
          $unwind: "$sellOrder.product",
        },
        {
          $project: {
            sellOrder: {
              shoeId: 0,
            },
          },
        },
      ])
      .exec();
  }

  public findById(transactionId: string) {
    return this.transactionRepo
      .findOne({
        _id: new ObjectId(transactionId),
      })
      .exec();
  }

  public findBySellOrderId(sellOrderId: ObjectId) {
    return this.transactionRepo.find({ sellOrderId }).exec();
  }

  public async updateAuthenticationStatus(
    transactionId: string,
    authenticationStatus: string,
    description: string
  ): Promise<Transaction | undefined> {
    return await this.transactionRepo
      .findOneAndUpdate(
        { _id: new ObjectId(transactionId) },
        {
          $push: {
            "tracking.trackingStatusHistory": {
              status: authenticationStatus,
              description: description,
            },
          },
        }
      )
      .exec();
  }

  public updateTrackingStatusByTransactionId(
    transactionId: string,
    status: string,
    description?: string,
    failureCode?: number
  ) {
    return this.transactionRepo
      .findOneAndUpdate(
        { _id: new ObjectId(transactionId) },
        {
          tracking: {
            $push: {
              status,
              description,
              failureCode,
            },
          },
        },
        {
          omitUndefined: true,
        }
      )
      .exec();
  }

  public async updatePaymentStatus(
    transactionId: ObjectId | string,
    paymentStatus: { status: PaymentStatus; message?: string }
  ) {
    await this.transactionRepo
      .findOneAndUpdate({ _id: transactionId }, { paymentStatus }, { omitUndefined: true })
      .exec();
    return;
  }

  public updateOnShippingOrderCreated(transaction: Transaction, shippingOrder: any) {
    return this.transactionRepo
      .findOneAndUpdate(
        { _id: transaction._id },
        {
          "tracking.ghnDeliverFromSellerCode": shippingOrder.OrderCode,
          "tracking.ghnDeliverFromSellerExpectedDelivery":
            shippingOrder.ExpectedDeliveryTime,
          $push: {
            "tracking.trackingStatusHistory": {
              status: TrackingStatus.SHIPPING_ORDER_FROM_SELLER_CREATED,
            },
          },
          "feeBreakdown.actualShippingFeeFromSellerToSnkg": shippingOrder.TotalServiceFee,
        }
      )
      .exec();
  }
}
