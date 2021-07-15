// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ObjectId } from "mongodb";
import { ShoeSize } from "../../assets";

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
    shoeInfo: {
      type: {
        title: String,
        brand: String,
        category: String,
        gender: String,
        name: String,
        thumbnail: String,
      },
    },
    shoeSize: {
      type: String,
      required: true,
      enum: [
        ...ShoeSize.Adult,
        ...ShoeSize.Women,
        ...ShoeSize.GradeSchool,
        ...ShoeSize.PreSchool,
        ...ShoeSize.Toddler,
      ],
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    note: String,
  },
  { timestamps: true }
);

export type Inventory = Document<{
  sellerId: ObjectId;
  shoeId: ObjectId;
  shoeSize: string;
  sellPrice: number;
  quantity: number;
  shoeInfo: {
    title: string;
    brand: string;
    category: string;
    gender: string;
    name: string;
  };
  note: string;
}>;

export const InventoryRepository: Repository<Inventory> = mongoose.model(
  "Inventory",
  InventorySchema
);
