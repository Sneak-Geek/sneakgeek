// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ObjectId } from "mongodb";
import { OrderStatus } from "../../assets/constants";

export const OrderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    status: {
      type: String,
      enum: Object.keys(OrderStatus),
      default: OrderStatus.PENDING,
    },
    shoeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      // require: true, phai seed lai data nen tam comment out
    },

  },
  { timestamps: true }
);

export type Order = Document<{
  buyerId: ObjectId;
  inventoryId: ObjectId;
  status: string;
}>;

export const OrderRepository: Repository<Order> = mongoose.model("Order", OrderSchema);
