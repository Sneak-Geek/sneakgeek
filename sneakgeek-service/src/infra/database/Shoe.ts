import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { Gender } from "../../assets";

export const ShoeSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    category: String,
    colorway: {
      type: [String],
      default: [],
    },
    description: String,
    gender: {
      type: String,
      enum: Object.keys(Gender),
    },
    releaseDate: Date,
    retailPrice: Number,
    name: String,
    shoe: String,
    title: {
      type: String,
      required: true,
      unique: true,
    },
    styleId: String,
    imageUrl: String,
    tags: [String],
  },
  { timestamps: true }
);

// Make sure the combination title-gender combines as index
ShoeSchema.index({ title: 1, gender: 1 });

export type Shoe = Document<{
  brand: string;
  category?: string;
  colorway?: Array<string>;
  description?: string;
  gender?: string;
  releaseDate?: Date;
  retailPrice?: number;
  name: string;
  shoe: string;
  title: string;
  styleId: string;
  imageUrl: string;
  tags: Array<string>;
}>;

export const ShoeRepository: Repository<Shoe> = mongoose.model("Shoe", ShoeSchema);
