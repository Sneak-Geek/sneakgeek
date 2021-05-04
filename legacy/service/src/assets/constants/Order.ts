// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

export enum OrderStatus {
  FAILED = "FAILED",
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
}

export type OrderType = "BuyOrder" | "SellOrder";

export enum TrackingStatus {
  WAITING_FOR_BANK_TRANSFER = "WAITING_FOR_BANK_TRANSFER", // Send to Buyer va SneakGeek
  RECEIVED_BANK_TRANSFER = "RECEIVED_BANK_TRANSFER", // Send to Buyer and SneakGeek and seller
  NOT_RECEIVED_BANK_TRANSFER = "NOT_RECEIVED_BANK_TRANSFER", // Send to Buyer and SneakGeek
  SELLER_APPROVED_ORDER = "SELLER_APPROVED_ORDER", // Send to SneakGeek and seller
  SELLER_REJECTED_ORDER = "SELLER_REJECTED_ORDER", //  Send to SneakGeek and Buyer and seller
  ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION = "ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION", // Khong can email
  SHOE_VERIFIED = "SHOE_VERIFIED", // Send SneakGeek
  SHOE_UNQUALIFIED = "SHOE_UNQUALIFIED", // Send to seller, buyer, and SneakGeek
  DELIVERING_TO_BUYER = "DELIVERING_TO_BUYER", // Khong can email
  BUYER_RECEIVED = "BUYER_RECEIVED", // Send to buyer, SneakGeek, seller
}

export const TrackingStatusOrdering: Map<TrackingStatus, TrackingStatus> = new Map<
  TrackingStatus,
  TrackingStatus
>([
  [TrackingStatus.RECEIVED_BANK_TRANSFER, TrackingStatus.WAITING_FOR_BANK_TRANSFER],
  [TrackingStatus.NOT_RECEIVED_BANK_TRANSFER, TrackingStatus.WAITING_FOR_BANK_TRANSFER],
  [TrackingStatus.SELLER_APPROVED_ORDER, TrackingStatus.RECEIVED_BANK_TRANSFER],
  [TrackingStatus.SELLER_REJECTED_ORDER, TrackingStatus.RECEIVED_BANK_TRANSFER],
  [
    TrackingStatus.ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION,
    TrackingStatus.SELLER_APPROVED_ORDER,
  ],
  [
    TrackingStatus.SHOE_VERIFIED,
    TrackingStatus.ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION,
  ],
  [
    TrackingStatus.SHOE_UNQUALIFIED,
    TrackingStatus.ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION,
  ],
  [TrackingStatus.DELIVERING_TO_BUYER, TrackingStatus.SHOE_VERIFIED],
  [TrackingStatus.BUYER_RECEIVED, TrackingStatus.DELIVERING_TO_BUYER],
]);

export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
}
