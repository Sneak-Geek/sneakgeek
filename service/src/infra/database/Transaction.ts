import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { PaymentStatus } from "../../assets/constants";
import { ObjectId } from "mongodb";

export enum TrackingStatusEnum {
  SHIPPING_ORDER_FROM_SELLER_CREATED = "SHIPPING_ORDER_FROM_SELLER_CREATED",
  PENDING_PICKUP_FROM_SELLER = "PENDING_PICKUP_FROM_SELLER",
  DELIVERING_TO_SNEAKGEEK = "DELIVERING_TO_SNEAKGEEK",
  DELIVERED_TO_SNEAKGEEK = "DELIVERED_TO_SNEAKGEEK",
  APPROVED_BY_SNEAKGEEK = "APPROVED_BY_SNEAKGEEK",
  REJECTED_BY_SNEAKGEEK = "REJECTED_BY_SNEAKGEEK",
  SHIPPING_ORDER_TO_BUYER_CREATED = "SHIPPING_ORDER_TO_BUYER_CREATED",
  PENDING_PICKUP_FROM_SNEAKGEEK = "PENDING_PICKUP_FROM_SNEAKGEEK",
  DELIVERING_TO_BUYER = "DELIVERING_TO_BUYER",
  DELIVERED_TO_BUYER = "DELIVERED_TO_BUYER",
  DELIVER_FAILED = "DELIVERED_FAILED",
}

export enum GhnFailureCode {
  ORDER_CANCELED = 1001,
  ORDER_LOST = 1002,
}

const TrackingSchema = new mongoose.Schema(
  {
    ghnDeliverFromSellerCode: {
      type: String,
      required: true,
    },
    ghnDeliverFromSellerExpectedDelivery: Date,
    ghnDeliverToBuyerCode: {
      type: String,
    },
    ghnDeliverToBuyerExpectedDelivery: Date,
    trackingStatusHistory: {
      type: [
        {
          status: {
            type: String,
            enum: Object.keys(TrackingStatusEnum),
            required: true,
          },
          failureCode: {
            type: Number,
            enum: [GhnFailureCode.ORDER_CANCELED, GhnFailureCode.ORDER_LOST],
          },
          description: String,
        },
        { timestamps: true },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const FeeBreakdownSchema = new mongoose.Schema(
  {
    productPrice: {
      type: Number,
      required: true,
    },
    estimatedShippingFeeFromSellerToSnkg: {
      type: Number,
      required: true,
    },
    estimatedShippingFeeFromSnkgToBuyer: {
      type: Number,
      required: true,
    },
    actualShippingFeeFromSellerToSnkg: {
      type: Number,
    },
    actualShippingFeeFromSnkgToBuyer: {
      type: Number,
    },
  },
  { strict: true }
);

const PaymentStatusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: PaymentStatus.PENDING,
    },
    message: {
      type: String,
    },
  },
  { strict: true }
);

export const TransactionSchema = new mongoose.Schema(
  {
    tracking: {
      type: TrackingSchema,
    },
    feeBreakdown: {
      type: FeeBreakdownSchema,
      required: true,
    },
    paymentStatus: {
      type: PaymentStatusSchema,
      required: true,
    },
    sellOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellOrder",
      required: true,
    },
    buyOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BuyOrder",
      required: true,
    },
  },
  { timestamps: true, strict: true }
);

export type Transaction = Document<{
  tracking?: {
    ghnDeliverFromSellerCode: string;
    ghnDeliverFromSellerExpectedDelivery?: Date;
    ghnDeliverToBuyerCode?: string;
    ghnDeliverToBuyerExpectedDelivery?: Date;
    trackingStatusHistory: [
      {
        status: TrackingStatusEnum;
        expectedDeliveryTime?: Date;
        description?: string;
      }
    ];
  };
  feeBreakdown: {
    productPrice: number;
    estimatedShippingFeeFromSellerToSnkg: number;
    estimatedShippingFeeFromSnkgToBuyer: number;
    actualShippingFeeFromSellerToSnkg?: number;
    actualShippingFeeFromSnkgToBuyer?: number;
  };
  paymentStatus: {
    status: PaymentStatus;
    message?: string;
  };
  sellOrderId: ObjectId;
  buyOrderId: ObjectId;
}>;

export const TransactionRepository: Repository<Transaction> = mongoose.model<Transaction>(
  "Transaction",
  TransactionSchema
);
