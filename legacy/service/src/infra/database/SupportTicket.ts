import mongoose from "mongoose";
import { Repository, Document } from "./Repository";

export enum SupportTicketResolveStatus {
  open = "open",
  pending = "pending",
  resolved = "resolved",
  closed = "closed",
}

export enum SupportTicketCategory {
  ProductComplaint = "ProductComplaint",
  AppCompaint = "AppComplaint",
  AccountComplaint = "AccountComplaint",
}

export const SupportTicketSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserAccount",
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
    },
    status: {
      type: String,
      enum: Object.keys(SupportTicketResolveStatus),
      default: SupportTicketResolveStatus.pending,
    },
    category: {
      type: String,
      required: true,
      enum: Object.keys(SupportTicketCategory),
    },
    feedback: {
      type: String,
      required: true,
      maxlength: 250,
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export type SupportTicket = Document<{
  requestedBy: string;
  handledBy?: string;
  status: string;
  category: string;
  feedback: string;
  imageUrls: Array<string>;
}>;

export const SupportTicketRepository: Repository<SupportTicket> = mongoose.model(
  "SupportTicket",
  SupportTicketSchema
);
