// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import { IOrderDao } from "./IOrderDao";
import { Order, Repository } from "../../database";
import { Types } from "../../../configuration/inversify";
import { ObjectId } from "mongodb";
import { OrderStatus } from "../../../assets";

@injectable()
export class OrderDao implements IOrderDao {
  @inject(Types.OrderRepository)
  private readonly orderRepo!: Repository<Order>;

  public async create(order: { buyerId: string; inventoryId: string }) {
    return this.orderRepo.create(order);
  }

  public async updateStatus(orderId: string, status: OrderStatus) {
    return this.orderRepo.findOneAndUpdate({ _id: orderId }, status).exec();
  }

  public async destroyById(OrderId: string | ObjectId): Promise<Order | undefined> {
    return this.orderRepo.findOneAndDelete({ _id: OrderId }).exec();
  }

  public findById(OrderId: string): Promise<Order | undefined> {
    return this.orderRepo.findById(OrderId).exec();
  }
}
