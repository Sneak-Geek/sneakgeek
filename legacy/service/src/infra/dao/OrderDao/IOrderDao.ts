//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { OrderStatus } from "../../../assets";
import { Order, Shoe } from "../../database";

export type TrendingOrder = {
  status: OrderStatus;
  sellPrice: number;
  shoe: Shoe;
}

export interface IOrderDao {
  create(order: { buyerId: string; inventoryId: string }): Promise<Order>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
  findById(orderId: string): Promise<Order>;
  destroyById(OrderId: string): Promise<Order>;
  getLastSold(top: number): Promise<TrendingOrder[]>;
}
