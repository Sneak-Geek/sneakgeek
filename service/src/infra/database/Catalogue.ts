import mongoose from "mongoose";
import { Repository, Document } from "./";
import { Shoe } from "./Shoe";

export enum CatalogType {
  COLLECTION = "COLLECTION",
  REGULAR = "REGULAR",
}

export const CatalogueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shoe",
      },
    ],
    coverImage: String,
    showOnHomepagePriority: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    catalogType: {
      type: String,
      enum: Object.keys(CatalogType),
    },
  },
  {
    timestamps: true,
    strict: true,
    toJSON: {
      virtuals: true,
    },
  }
);

CatalogueSchema.virtual("products", {
  ref: "Shoe",
  localField: "productIds",
  foreignField: "_id",
});

export type Catalogue = Document<{
  title: string;
  description: string;
  productIds: Array<mongoose.Types.ObjectId>;
  products: Array<Shoe>;
  coverImage: string;
  showOnHomepagePriority: number;
  tags: Array<string>;
  catalogType: CatalogType;
}>;

export const CatalogueRepository: Repository<Catalogue> = mongoose.model<Catalogue>(
  "Catalogue",
  CatalogueSchema
);
