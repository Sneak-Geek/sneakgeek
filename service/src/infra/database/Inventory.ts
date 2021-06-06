// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ObjectId } from "mongodb";

export const InventorySchema = new mongoose.Schema(
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
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export type Inventory = Document<{
  sellerId: ObjectId;
  shoeId: ObjectId;
  shoeSize: string;
  sellPrice: number;
  quantity: number;
}>;

export const InventoryRepository: Repository<Inventory> = mongoose.model(
  "Inventory",
  InventorySchema
);
