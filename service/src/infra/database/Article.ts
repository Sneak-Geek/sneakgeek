import mongoose from "mongoose";
import { Repository, Document } from "./Repository";

export const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    markdownKey: {
      type: String,
      required: true,
    },
    htmlKey: {
      type: String,
      required: true,
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
  },
  { timestamps: true }
);

export type Article = Document<{
  title: string;
  markdownKey: string;
  htmlKey: string;
  createdByUser: string;
}>;

export const ArticleRepository: Repository<Article> = mongoose.model<Article>(
  "Article",
  ArticleSchema
);
