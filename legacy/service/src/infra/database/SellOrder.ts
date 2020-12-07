// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ShoeSize, ShoeBoxCondition } from "../../assets/settings";
import { OrderStatus } from "../../assets/constants";
import { Strings } from "../../assets";
import { ObjectId } from "mongodb";
import { UserProfile, Shoe } from "../database";
import { Transaction } from "./Transaction";

const ProductConditionSchema = new mongoose.Schema({
  boxCondition: {
    type: String,
    enum: ShoeBoxCondition,
    default: Strings.ShoeBoxCondition_FullBox,
  },
  isTainted: {
    type: Boolean,
    default: false,
  },
  isTorn: {
    type: Boolean,
    default: false,
  },
  isInsoleWorn: {
    type: Boolean,
    default: false,
  },
  isOutsoleWorn: {
    type: Boolean,
    default: false,
  },
  otherDetail: {
    type: String,
    maxlength: 140,
  },
});

export const SellOrderSchema = new mongoose.Schema(
  {
    sellerId: {
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
    sellPrice: {
      type: Number,
      required: true,
    },
    productCondition: {
      type: ProductConditionSchema,
    },
    pictures: [String],
    status: {
      type: String,
      enum: Object.keys(OrderStatus),
      default: OrderStatus.PENDING,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

SellOrderSchema.virtual("seller", {
  ref: "UserProfile",
  localField: "sellerId",
  foreignField: "_id",
  justOne: true,
});

SellOrderSchema.virtual("shoe", {
  ref: "Shoe",
  localField: "shoeId",
  foreignField: "_id",
  justOne: true,
});

SellOrderSchema.virtual("transaction", {
  ref: "Transaction",
  localField: "transactionId",
  foreignField: "_id",
  justOne: true,
});

export type SellOrder = Document<{
  sellerId: ObjectId;
  shoeId: ObjectId;
  shoeSize: string;
  isNewShoe: boolean;
  sellPrice: number;
  productCondition?: {
    shoeCondition?: string;
    boxCondition?: string;
    isTainted?: boolean;
    isTorn?: boolean;
    isOutsoleWorn?: boolean;
    otherDetail?: string;
  };
  status: string;
  pictures?: Array<string>;
  transactionId?: string;
  isDeleted?: boolean;
}>;

export type PopulatedSellOrder = SellOrder & {
  seller: UserProfile;
  shoe: Shoe;
  transaction?: Transaction;
};

export const SellOrderRepository: Repository<SellOrder> = mongoose.model(
  "SellOrder",
  SellOrderSchema
);
