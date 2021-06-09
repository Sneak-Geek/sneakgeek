import mongoose from "mongoose";
import { Repository, Document } from "./Repository";

export const VerificationSchemaName = "Verification";

export const VerificationSchema = new mongoose.Schema(
  {
    verificationToken: {
      type: String,
      unique: true,
    },
    createdAt: {
      type: Date,
      expires: 60 * 60 * 24, // 24 hour
      default: Date.now,
    },
    userAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
    },
  },
  { timestamps: true }
);

export type Verification = Document<{
  verificationToken: string;
  createdAt: Date;
  userAccountId: string;
}>;

export const VerificationRepository: Repository<Verification> = mongoose.model(
  VerificationSchemaName,
  VerificationSchema
);
