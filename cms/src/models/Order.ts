export enum OrderStatus {
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export type ShippingAddress = {
  addressLine1: string;
  addressLine2: string;
};

export enum TrackingStatus {
  WAITING_FOR_BANK_TRANSFER = 'WAITING_FOR_BANK_TRANSFER',
  RECEIVED_BANK_TRANSFER = 'RECEIVED_BANK_TRANSFER',
  NOT_RECEIVED_BANK_TRANSFER = 'NOT_RECEIVED_BANK_TRANSFER',
  SELLER_APPROVED_ORDER = 'SELLER_APPROVED_ORDER',
  SELLER_REJECTED_ORDER = 'SELLER_REJECTED_ORDER',
  REFUND_TO_BUYER = 'REFUND_TO_BUYER',
  ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION = 'ORDER_BEING_SENT_TO_SNKGK_FOR_AUTHENTICATION',
  SHOE_VERIFIED = 'SHOE_VERIFIED',
  SHOE_UNQUALIFIED = 'SHOE_UNQUALIFIED',
  DELIVERING_TO_BUYER = 'DELIVERING_TO_BUYER',
  BUYER_RECEIVED = 'BUYER_RECEIVED',
}

export type TrackingStatusWithDate = {
  status: TrackingStatus;
  date: Date;
};

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
}

type Order = {
  buyerId: string;
  shoeId: string;
  inventoryId: string;
  inventory: Object;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  soldPrice: number;
  trackingStatus: Array<TrackingStatusWithDate>;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
};

export default Order;
