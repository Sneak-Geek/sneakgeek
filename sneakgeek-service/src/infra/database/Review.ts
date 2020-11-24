import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ObjectId } from "mongodb";

export const ReviewSchemaName = "Review";

export const ReviewSchema = new mongoose.Schema(
  {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserAccount",
    },
    shoeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Shoe",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, strict: true }
);

export type Review = Document<{
  reviewedBy: ObjectId | string;
  shoeId: ObjectId | string;
  rating: number;
  description: string;
  imageUrls: Array<string>;
}>;

export const ReviewRepository: Repository<Review> = mongoose.model(
  ReviewSchemaName,
  ReviewSchema
);
