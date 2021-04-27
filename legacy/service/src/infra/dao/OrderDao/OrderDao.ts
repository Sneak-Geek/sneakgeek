// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import { IOrderDao, OrderHistory, TrendingOrder } from "./IOrderDao";
import { Inventory, Order, Repository, Shoe } from "../../database";
import { Types } from "../../../configuration/inversify";
import { ObjectId } from "mongodb";
import { OrderStatus } from "../../../assets/constants";
import mongoose from "mongoose";

@injectable()
export class OrderDao implements IOrderDao {
  @inject(Types.OrderRepository)
  private readonly orderRepo!: Repository<Order>;

  public async create(order: {
    buyerId: string;
    inventoryId: string;
    shippingAddress: { addressLine1: string; addressLine2: string };
  }) {
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
        {
          $sort: {
            updatedAt: -1,
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

  async getAllPendingOrders(start: number, pageSize: number): Promise<OrderHistory[]> {
    const query = [
      {
        $match: { status: OrderStatus.PENDING },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $limit: pageSize,
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
          // TODO(hoangpham95): change back to shoeId once completely migrated
          localField: "inventory.shoeId",
          foreignField: "_id",
          as: "shoe",
        },
      },
      {
        $unwind: { path: "$shoe" },
      },
    ];
    if (start > 1) {
      query.splice(2, 0, { $skip: start - 1 } as any);
    }

    return this.orderRepo.aggregate(query).exec();
  }

  async getOrderById(orderId: string): Promise<OrderHistory> {
    const result = await this.orderRepo
      .aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(orderId),
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
          $unwind: {
            path: "$inventory",
          },
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

    return result[0];
  }
}
