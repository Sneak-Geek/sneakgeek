//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { OrderStatus } from "../../../assets";
import { Order } from "../../database";

export interface IOrderDao {
  create(order: { buyerId: string; inventoryId: string }): Promise<Order>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order>;
  findById(orderId: string): Promise<Order>;
  destroyById(OrderId: string): Promise<Order>;
}
