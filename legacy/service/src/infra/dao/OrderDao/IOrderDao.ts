//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { OrderStatus, PaymentMethod } from "../../../assets";
import { Inventory, Order, Shoe } from "../../database";

export type TrendingOrder = {
  status: OrderStatus;
  sellPrice: number;
  shoe: Shoe;
};

export type OrderHistory = Order & {
  inventory: Inventory;
  shoe: Shoe;
};

export interface IOrderDao {
  create(order: {
    buyerId: string;
    inventoryId: string;
    shoeId: string;
    shippingAddress: { addressLine1: string; addressLine2: string };
    sellingPrice: number;
    paymentMethod: PaymentMethod;
  }): Promise<Order>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
  findById(orderId: string): Promise<Order>;
  destroyById(OrderId: string): Promise<Order>;
  getLastSold(top: number): Promise<TrendingOrder[]>;
  getOrderHistoryByUserId(buyerId: string): Promise<OrderHistory[]>;
  getPendingOrdersCount(): Promise<number>;
  getAllPendingOrders(start: number, end: number): Promise<OrderHistory[]>;
  getOrderById(orderId: string): Promise<OrderHistory>;
}
