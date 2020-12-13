// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import { IOrderDao, OrderHistory, TrendingOrder } from "./IOrderDao";
import { Order, Repository } from "../../database";
import { Types } from "../../../configuration/inversify";
import { ObjectId } from "mongodb";
import { OrderStatus } from "../../../assets/constants";
import mongoose from "mongoose";

@injectable()
export class OrderDao implements IOrderDao {
  @inject(Types.OrderRepository)
  private readonly orderRepo!: Repository<Order>;

  public async create(order: { buyerId: string; inventoryId: string }) {
    return this.orderRepo.create(order);
  }

  public async updateStatus(orderId: string, status: OrderStatus) {
    return this.orderRepo
      .findOneAndUpdate({ _id: mongoose.Types.ObjectId(orderId) }, status)
      .exec();
  }

  public async destroyById(OrderId: string | ObjectId): Promise<Order | undefined> {
    return this.orderRepo.findOneAndDelete({ _id: OrderId }).exec();
  }

  public findById(OrderId: string): Promise<Order | undefined> {
    return this.orderRepo.findById(OrderId).exec();
  }

  public async getOrderHistoryByUserId(buyerId: string): Promise<OrderHistory[]> {
    return this.orderRepo
      .aggregate([
        {
          $match: {
            buyerId: mongoose.Types.ObjectId(buyerId),
          },
        },
        {
          $lookup: {
            from: "inventories",
            localField: "inventoryId",
            foreignField: "_id",
            as: "inventory",
          },
        },
        {
          $unwind: { path: "$inventory" },
        },
        {
          $lookup: {
            from: "shoes",
            localField: "inventory.shoeId",
            foreignField: "_id",
            as: "shoe",
          },
        },
        {
          $unwind: {
            path: "$shoe",
          },
        },
      ])
      .exec();
  }

  async getLastSold(top: number): Promise<TrendingOrder[]> {
    const result = await this.orderRepo
      .aggregate([
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: { status: OrderStatus.COMPLETED },
        },
        {
          $lookup: {
            from: "inventories",
            localField: "inventoryId",
            foreignField: "_id",
            as: "inventory",
          },
        },
        { $unwind: { path: "$inventory" } },
        {
          $group: {
            _id: "$inventory.shoeId",
            status: { $first: "$status" },
            sellPrice: { $min: "$inventory.sellPrice" },
          },
        },
        { $limit: top },
        {
          $lookup: {
            from: "shoes",
            localField: "_id",
            foreignField: "_id",
            as: "shoe",
          },
        },
        { $unwind: { path: "$shoe" } },
        { $project: { _id: 0 } },
      ])
      .exec();

    return result;
  }
}
