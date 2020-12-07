// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

export enum OrderStatus {
  CANCELED = "CANCELED",
  DENIED = "DENIED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  COMPLETED = "COMPLETED",
}

export type OrderType = "BuyOrder" | "SellOrder";
