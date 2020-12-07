import mongoose from "mongoose";
import { Repository, Document } from "./Repository";
import { ObjectId } from "mongodb";
import { Shoe } from "./Shoe";

export enum BalanceHistoryStatus {
  PROCESSING = "PROCESSING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export enum BalanceHistoryAction {
  WITHDRAW = "WITHDRAW",
  DEPOSIT = "DEPOSIT",
}

export type BankingInfo = {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  lastFourDigits: string;
};

export const BankingInfoSchema = new mongoose.Schema({
  bankName: {
    type: String,
  },
  accountNumber: {
    type: String,
  },
  accountHolderName: {
    type: String,
  },
  lastFourDigits: {
    type: String,
  },
});

export const BalanceHistorySchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "UserProfile",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
    prevBalance: {
      // only exists if this balancehistory status === BalanceHistoryStatus.SUCCEEDED
      type: Number,
    },
    amount: {
      type: Number,
      require: true,
    },
    status: {
      type: String,
      enum: Object.keys(BalanceHistoryStatus),
      require: true,
    },
    action: {
      type: String,
      enum: Object.keys(BalanceHistoryAction),
      require: true,
    },
    bankingInfo: {
      type: BankingInfoSchema,
    },
    shoeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shoe",
    },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

export type BalanceHistory = Document<{
  profileId: ObjectId;
  prevBalance: number;
  amount: number;
  status: BalanceHistoryStatus;
  action: BalanceHistoryAction;
  transactionId?: ObjectId;
  bankingInfo?: BankingInfo;
  shoeId?: mongoose.Schema.Types.ObjectId;
}>;

export type PopulatedBalanceHistory = BalanceHistory & {
  shoe: Shoe;
};

BalanceHistorySchema.virtual("shoe", {
  ref: "Shoe",
  localField: "shoeId",
  foreignField: "_id",
  justOne: true,
});

export const BalanceHistoryRepository: Repository<BalanceHistory> = mongoose.model(
  "BalanceHistory",
  BalanceHistorySchema
);
