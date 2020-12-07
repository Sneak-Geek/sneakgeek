// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import { Repository, SellOrder, PopulatedSellOrder } from "../../database";
import { Types } from "../../../configuration/inversify";
import mongoose from "mongoose";
import {
  ISellOrderDao,
  SellOrderNewShoeCreateInput,
  SellOrderUpdateInput,
  SellOrderUsedShoeCreateInput,
} from "./ISellOrderDao";
import { OrderStatus } from "../../../assets/constants";
import { ObjectId } from "mongodb";

@injectable()
export class SellOrderDao implements ISellOrderDao {
  @inject(Types.SellOrderRepository)
  private readonly sellOrderRepo!: Repository<SellOrder>;

  public async createSellOrderNewShoe(
    input: SellOrderNewShoeCreateInput
  ): Promise<SellOrder> {
    return this.sellOrderRepo.create({
      sellerId: input.sellerId,
      shoeId: input.shoeId,
      shoeSize: input.shoeSize,
      isNewShoe: true,
      sellPrice: input.sellPrice,
    });
  }

  public async createSellOrderUsedShoe(
    input: SellOrderUsedShoeCreateInput
  ): Promise<SellOrder> {
    return this.sellOrderRepo.create({
      sellerId: input.sellerId,
      shoeId: input.shoeId,
      shoeSize: input.shoeSize,
      isNewShoe: false,
      sellPrice: input.sellPrice,
      productCondition: input.productCondition,
      pictures: input.pictures,
    });
  }

  public async deleteById(sellOrderId: string): Promise<SellOrder | undefined> {
    return await this.sellOrderRepo
      .findOneAndUpdate({ _id: sellOrderId }, { isDeleted: true })
      .exec();
  }

  public async destroyById(sellOrderId: string | ObjectId): Promise<SellOrder | undefined> {
    return this.sellOrderRepo.findOneAndDelete({ _id: sellOrderId }).exec();
  }

  public updateStatusById(sellOrderId: string, newStatus: string) {
    return this.sellOrderRepo
      .findOneAndUpdate({ _id: sellOrderId }, { status: newStatus }, { new: true })
      .exec();
  }

  public findById(sellOrderId: string) {
    return this.sellOrderRepo.findById(sellOrderId).exec();
  }

  public async findByIdAndPopulate(sellOrderId: string) {
    let result = await this.findById(sellOrderId);
    if (result) {
      result = await this.populate(result);
    }
    return result as PopulatedSellOrder;
  }

  public async findLowestSellOrderByShoeId(shoeId: string) {
    return this.sellOrderRepo
      .findOne({ shoeId, status: OrderStatus.APPROVED })
      .sort({ sellPrice: 1 }) // sort by ascending order
      .exec();
  }

  public async findLowestSellOrderByShoeIdAndShoeSize(
    shoeId: string,
    shoeSize: string
  ): Promise<SellOrder | undefined> {
    return this.sellOrderRepo
      .findOne({ shoeId, shoeSize, status: OrderStatus.APPROVED })
      .sort({ sellPrice: 1 }) // sort by ascending order
      .exec();
  }

  public async findAll(): Promise<SellOrder[]> {
    return this.sellOrderRepo.find({}).exec();
  }

  public async findBySellerIdAndPopulate(
    sellerId: string | ObjectId
  ): Promise<SellOrder[]> {
    const sellOrders = await this.sellOrderRepo
      .find({
        sellerId: mongoose.Types.ObjectId(sellerId.toString()),
        status: {
          $ne: OrderStatus.CANCELED,
        },
      })
      .sort({ createdAt: -1 })
      .exec();
    return this.populate(sellOrders);
  }

  public async updateSellOrder(
    update: SellOrderUpdateInput
  ): Promise<SellOrder | undefined> {
    const query = {
      "productCondition.boxCondition": update.productCondition?.boxCondition,
      "productCondition.isTainted": update.productCondition?.isTainted,
      "productCondition.isTorn": update.productCondition?.isTorn,
      "productCondition.isInsoleWorn": update.productCondition?.isInsoleWorn,
      "productCondition.isOutsoleWorn": update.productCondition?.isOutsoleWorn,
      "productCondition.otherDetail": update.productCondition?.otherDetail,
      sellPrice: update.sellPrice,
    };
    const updatedSellOrder = await this.sellOrderRepo.findOneAndUpdate(
      { _id: update.orderId },
      query,
      { new: true, omitUndefined: true }
    );
    return updatedSellOrder;
  }

  public async cancelSellOrder(sellOrderId: string): Promise<SellOrder> {
    const sellOrder = await this.sellOrderRepo.findById(sellOrderId);
    if (!sellOrder) {
      throw new Error("Sell order do not exists");
    }

    return this.sellOrderRepo
      .findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(sellOrderId) },
        { status: OrderStatus.CANCELED },
        { new: true }
      )
      .exec();
  }

  public async findLowestSellPriceSizeMap(shoeId: string) {
    return this.sellOrderRepo
      .aggregate()
      .match({
        shoeId: mongoose.Types.ObjectId(shoeId),
        status: OrderStatus.APPROVED,
      })
      .group({
        _id: "$shoeSize",
        price: { $min: "$sellPrice" },
      })
      .project({
        _id: 0,
        price: 1,
        size: "$_id",
      })
      .exec();
  }

  public async populate(sellOrder: any): Promise<any> {
    return this.sellOrderRepo.populate(sellOrder, {
      path: "seller shoe transaction ",
    });
  }

  public updateTransactionId(sellOrderId: ObjectId, transactionId: ObjectId) {
    return this.sellOrderRepo
      .findOneAndUpdate({ _id: sellOrderId }, { transactionId })
      .exec();
  }
}
