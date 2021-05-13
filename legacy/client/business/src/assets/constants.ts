export enum OrderStatus {
  DENIED = "DENIED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  COMPLETED = "COMPLETED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSED = "PROCESSED",
  CANCELED = "CANCELED"
}

export enum TrackingStatus {
  WAITING_FOR_BANK_TRANSFER = "WAITING_FOR_BANK_TRANSFER", // Send to Buyer va SneakGeek
  RECEIVED_BANK_TRANSFER = "RECEIVED_BANK_TRANSFER", // Send to Buyer and SneakGeek and seller
  NOT_RECEIVED_BANK_TRANSFER = "NOT_RECEIVED_BANK_TRANSFER", // Send to Buyer and SneakGeek
  SELLER_APPROVED_ORDER = "SELLER_APPROVED_ORDER", // Send to SneakGeek and seller
  SELLER_REJECTED_ORDER = "SELLER_REJECTED_ORDER", //  Send to SneakGeek and Buyer and seller
  REFUND_TO_BUYER = "REFUND_TO_BUYER",
  ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION = "ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION", // Khong can email
  SHOE_VERIFIED = "SHOE_VERIFIED", // Send SneakGeek
  SHOE_UNQUALIFIED = "SHOE_UNQUALIFIED", // Send to seller, buyer, and SneakGeek
  DELIVERING_TO_BUYER = "DELIVERING_TO_BUYER", // Khong can email
  BUYER_RECEIVED = "BUYER_RECEIVED", // Send to buyer, SneakGeek, seller
}


export enum Gender {
  none = "none",
  men = "men",
  women = "women",
  unisex = "unisex",
  child = "child",
  toddler = "toddler",
  infant = "infant",
  preschool = "preschool"
}