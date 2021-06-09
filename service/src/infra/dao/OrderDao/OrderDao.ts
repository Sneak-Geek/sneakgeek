// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import { IOrderDao, OrderHistory, TrendingOrder } from "./IOrderDao";
import { Inventory, Order, Repository, Shoe } from "../../database";
import { Types } from "../../../configuration/inversify";
import { ObjectId } from "mongodb";
import {
  OrderStatus,
  PaymentMethod,
  TrackingStatus,
  TrackingStatusOrdering,
} from "../../../assets/constants";
import mongoose from "mongoose";

@injectable()
export class OrderDao implements IOrderDao {
  @inject(Types.OrderRepository)
  private readonly orderRepo!: Repository<Order>;

  public async create(order: {
    buyerId: string;
    inventoryId: string;
    shoeId: string;
    shippingAddress: { addressLine1: string; addressLine2: string };
    soldPrice: number;
    paymentMethod: PaymentMethod;
    trackingStatus: Array<{ status: TrackingStatus; date: Date }>;
  }) {
    return this.orderRepo.create(order);
  }

  public async updateStatus(orderId: string, status: OrderStatus) {
    return this.orderRepo
      .findOneAndUpdate({ _id: mongoose.Types.ObjectId(orderId) }, status)
      .exec();
  }

  private async updateTrackingAndOrderStatusHelper(
    refundInfo: string | undefined,
    orderId: string,
    trackingStatus: TrackingStatus,
    orderStatus: OrderStatus = OrderStatus.PENDING
  ): Promise<Order> {
    const updates = {
      $push: { trackingStatus: { status: trackingStatus, date: Date.now() } },
      status: orderStatus,
    };
    if (refundInfo) {
      updates["refundInfo"] = refundInfo;
    }
    return this.orderRepo.findOneAndUpdate({ _id: orderId }, updates);
  }

  private _isValidTrackingStatus(status: TrackingStatus): Boolean {
    return TrackingStatusOrdering.has(status);
  }

  private _isValidTrackingOrdering(
    trackingStatus: Array<{ status: TrackingStatus; date: Date }>,
    status: TrackingStatus
  ): Boolean {
    return (
      trackingStatus[trackingStatus.length - 1].status ===
      TrackingStatusOrdering.get(status)
    );
  }

  private _isValidOrderStatus(order: Order): Boolean {
    return order.status !== OrderStatus.FAILED && order.status !== OrderStatus.COMPLETED;
  }

  public async updateTrackingAndOrderStatus(
    orderId: string,
    status: TrackingStatus,
    refundInfo?: string
  ): Promise<Order> {
    const order = await this.findById(orderId);
    const { trackingStatus } = order;

    if (
      !this._isValidTrackingStatus(status) ||
      !this._isValidTrackingOrdering(trackingStatus, status) ||
      !this._isValidOrderStatus(order)
    )
      return Promise.reject(new Error("Please check orderStatus and trackingStatus!"));

    if (
      status === TrackingStatus.NOT_RECEIVED_BANK_TRANSFER ||
      status === TrackingStatus.SELLER_REJECTED_ORDER ||
      status === TrackingStatus.SHOE_UNQUALIFIED ||
      status === TrackingStatus.REFUND_TO_BUYER
    ) {
      return this.updateTrackingAndOrderStatusHelper(
        refundInfo,
        orderId,
        status,
        OrderStatus.FAILED
      );
    } else if (status === TrackingStatus.BUYER_RECEIVED) {
      return this.updateTrackingAndOrderStatusHelper(
        undefined,
        orderId,
        status,
        OrderStatus.COMPLETED
      );
    } else return this.updateTrackingAndOrderStatusHelper(undefined, orderId, status);
  }

  public async destroyById(OrderId: string | ObjectId): Promise<Order | undefined> {
    return this.orderRepo.findOneAndDelete({ _id: OrderId }).exec();
  }

  public findById(OrderId: string): Promise<Order | undefined> {
    return this.orderRepo.findById(OrderId).exec();
  }

  public async getUserHistory(profileId: string, isSeller: boolean): Promise<Order[]> {
    const matchField = isSeller ? "sellerId" : "buyerId";
    const matchQuery = { [matchField]: mongoose.Types.ObjectId(profileId) };
    return this.orderRepo
      .aggregate([
        {
          $match: matchQuery,
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
            localField: "shoeId",
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

  async getPendingOrdersCount(): Promise<number> {
    return this.orderRepo.count({ status: OrderStatus.PENDING });
  }

  async getAllPendingOrders(start: number, end: number): Promise<OrderHistory[]> {
    const query = [
      {
        $match: { status: OrderStatus.PENDING },
      },
      {
        $sort: { createdAt: 1 },
      },
      {
        $limit: end - start + 1,
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
