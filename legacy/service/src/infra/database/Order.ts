// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ObjectId } from "mongodb";
import { OrderStatus, TrackingStatus, PaymentMethod } from "../../assets/constants";
import { UserAddress, UserProvidedAddressSchema } from "./UserProfile";

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
      require: true,
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
      require: true,
    },
    shippingAddress: {
      type: UserProvidedAddressSchema,
      required: true,
    },
    soldPrice: {
      type: Number,
      require: true,
    },
    trackingStatus: {
      type: [
        {
          status: { type: String, enum: Object.keys(TrackingStatus) },
          date: Date,
        },
      ],
      default: [],
      require: true,
    },
    paymentMethod: {
      type: String,
      enum: Object.keys(PaymentMethod),
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export type Order = Document<{
  buyerId: ObjectId;
  shoeId: ObjectId;
  inventoryId: ObjectId;
  status: string;
  shippingAddress: UserAddress;
  soldPrice: number;
  paymentMethod: string;
  trackingStatus: Array<{ status: TrackingStatus; date: Date }>;
}>;

export const OrderRepository: Repository<Order> = mongoose.model("Order", OrderSchema);
