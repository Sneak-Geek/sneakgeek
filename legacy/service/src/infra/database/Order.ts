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
  },
  { timestamps: true }
);

export type Order = Document<{
  buyerId: ObjectId;
  inventoryId: ObjectId;
}>;

export const OrderRepository: Repository<Order> = mongoose.model("Order", OrderSchema);
