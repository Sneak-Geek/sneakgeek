// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ObjectId } from "mongodb";
import { OrderStatus, TrackingStatus, PaymentMethod } from "../../assets/constants";
import { UserAddress, UserProvidedAddressSchema } from "./UserProfile";

const TrackingSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.keys(TrackingStatus),
      require: true,
    },
  },
  { timestamps: true }
);

export const OrderSchema = new mongoose.Schema(
  {
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    shoeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoe",
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
    shippingAddress: {
      type: UserProvidedAddressSchema,
      required: true,
    },
    sellingPrice: {
      type: Number,
      require: true,
    },
    trackingStatus: [TrackingSchema],
    paymentMethod: {
      type: String,
      enum: Object.keys(PaymentMethod),
      require: true,
    },
  },
  { timestamps: true }
);

export type Order = Document<{
  buyerId: ObjectId;
  inventoryId: ObjectId;
  status: string;
  shippingAddress: UserAddress;
  sellingPrice: number;
  paymentMethod: string;
}>;

export const OrderRepository: Repository<Order> = mongoose.model("Order", OrderSchema);
