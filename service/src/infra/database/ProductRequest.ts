import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { Brand, Gender, ShoeSize } from "../../assets";

export enum RequestStatus {
  pending = "pending",
  rejected = "rejected",
  approved = "approved",
}

export const ProductRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      enum: Object.keys(Brand),
      required: true,
    },
    gender: {
      type: String,
      enum: Object.keys(Gender),
    },
    colorways: {
      type: [String],
      default: [],
    },
    size: {
      type: String,
      enum: ShoeSize.Adult,
    },
    requestStatus: {
      type: String,
      enum: Object.keys(RequestStatus),
      default: RequestStatus.pending,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export type ProductRequest = Document<{
  title: string;
  brand: string;
  gender?: string;
  colorways: string;
  size?: string;
  requestStatus: string;
  imageUrls: Array<string>;
}>;

export const ProductRequestRepository: Repository<ProductRequest> = mongoose.model(
  "ProductRequest",
  ProductRequestSchema
);
