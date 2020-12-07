// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { OrderStatus } from "../../assets/constants";
import { ShoeSize } from "../../assets/settings";
import { ObjectId } from "mongodb";
import { UserProfile } from "./UserProfile";
import { Shoe } from "./Shoe";
import { SellOrder } from "./SellOrder";
import { Transaction } from "./Transaction";

export const BuyOrderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    shoeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoe",
      required: true,
    },
    shoeSize: {
      type: String,
      enum: ShoeSize.Adult,
      required: true,
    },
    isNewShoe: {
      type: Boolean,
      required: true,
    },
    buyPrice: {
      type: Number,
      required: true,
    },
    sellOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellOrder",
    },
    status: {
      type: String,
      enum: Object.keys(OrderStatus),
      default: OrderStatus.PENDING,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

BuyOrderSchema.virtual("buyer", {
  ref: "UserProfile",
  localField: "buyerId",
  foreignField: "_id",
  justOne: true,
});

BuyOrderSchema.virtual("shoe", {
  ref: "Shoe",
  localField: "shoeId",
  foreignField: "_id",
  justOne: true,
});

BuyOrderSchema.virtual("sellOrder", {
  ref: "SellOrder",
  localField: "sellOrderId",
  foreignField: "_id",
  justOne: true,
});

BuyOrderSchema.virtual("transaction", {
  ref: "Transaction",
  localField: "transactionId",
  foreignField: "_id",
  justOne: true,
});

export type BuyOrder = Document<{
  buyerId: ObjectId;
  shoeId: ObjectId;
  buyPrice: number;
  shoeSize: string;
  isNewShoe: boolean;
  sellOrderId?: ObjectId;
  status: string;
  transactionId?: ObjectId;
}>;

export type PopulatedBuyOrder = BuyOrder & {
  buyer: UserProfile;
  shoe: Shoe;
  sellOrder?: SellOrder;
  transaction?: Transaction;
};

export const BuyOrderRepository: Repository<BuyOrder> = mongoose.model(
  "BuyOrder",
  BuyOrderSchema
);
