// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { injectable, inject } from "inversify";
import {
  IBuyOrderDao,
  BuyOrderNewShoeCreateInput,
  BuyOrderUsedShoeCreateInput,
} from "./IBuyOrderDao";
import { BuyOrder, Repository, SellOrder, PopulatedBuyOrder } from "../../database";
import { Types } from "../../../configuration/inversify";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { OrderStatus } from "../../../assets/constants";

@injectable()
export class BuyOrderDao implements IBuyOrderDao {
  @inject(Types.BuyOrderRepository)
  private readonly buyOrderRepo!: Repository<BuyOrder>;

  public async createBuyOrderNewShoe(input: BuyOrderNewShoeCreateInput): Promise<BuyOrder> {
    return this.buyOrderRepo.create({
      buyerId: input.buyerId,
      shoeId: input.shoeId,
      buyPrice: input.buyPrice,
      shoeSize: input.shoeSize,
      isNewShoe: true,
    });
  }

  public async createBuyOrderUsedShoe(
    input: BuyOrderUsedShoeCreateInput
  ): Promise<BuyOrder> {
    return this.buyOrderRepo.create({
      buyerId: input.buyerId,
      shoeId: input.shoeId,
      buyPrice: input.buyPrice,
      shoeSize: input.shoeSize,
      isNewShoe: false,
      sellOrderId: input.sellOrderId,
    });
  }

  public async createBuyOrderFromSellOrder(
    buyerId: string,
    sellOrder: SellOrder
  ): Promise<BuyOrder> {
    return this.buyOrderRepo.create({
      buyerId,
      shoeId: sellOrder.shoeId,
      shoeSize: sellOrder.shoeSize,
      buyPrice: sellOrder.sellPrice,
      isNewShoe: sellOrder.isNewShoe,
      sellOrderId: sellOrder._id,
      status: OrderStatus.APPROVED,
    });
  }

  public async destroyById(buyOrderId: string | ObjectId): Promise<BuyOrder | undefined> {
    return this.buyOrderRepo.findOneAndDelete({ _id: buyOrderId }).exec();
  }

  public findById(buyOrderId: string): Promise<BuyOrder | undefined> {
    return this.buyOrderRepo.findById(buyOrderId).exec();
  }

  public async findByIdAndPopulate(
    buyOrderId: string
  ): Promise<PopulatedBuyOrder | undefined> {
    const buyOrder = await this.buyOrderRepo.findOne({ _id: buyOrderId }).exec();
    return this.populate(buyOrder);
  }

  public async findByBuyerIdAndPopulate(
    buyerId: string | ObjectId
  ): Promise<PopulatedBuyOrder[]> {
    const buyOrders = await this.buyOrderRepo
      .find({ buyerId })
      .sort({ createdAt: -1 })
      .exec();
    return this.populate(buyOrders);
  }

  public async findMatchingPriceBuyOrderWithBuyer(
    sellOrder: SellOrder
  ): Promise<PopulatedBuyOrder[]> {
    if (sellOrder.isNewShoe) {
      const buyOrders = await this.buyOrderRepo
        .find({
          shoeId: sellOrder.shoeId,
          shoeSize: sellOrder.shoeSize,
          isNewShoe: true,
          buyPrice: { $gte: sellOrder.sellPrice },
        })
        .exec();
      return this.populate(buyOrders);
    }
    // TODO: add support for used shoe
    return [];
  }

  public updateStatusById(buyOrderId: ObjectId | string, newStatus: OrderStatus) {
    return this.buyOrderRepo
      .findOneAndUpdate({ _id: buyOrderId }, { status: newStatus }, { new: true })
      .exec();
  }

  public async findAll(): Promise<BuyOrder[]> {
    return await this.buyOrderRepo.find().exec();
  }

  public async findHighestBuyOrderByShoeId(shoeId: string) {
    return this.buyOrderRepo
      .findOne({ shoeId, status: OrderStatus.APPROVED })
      .sort({ buyPrice: -1 }) // sort by descending order
      .exec();
  }

  public async findHighestBuyOrderByShoeIdAndShoeSize(
    shoeId: string,
    shoeSize: string
  ): Promise<BuyOrder | undefined> {
    return this.buyOrderRepo
      .findOne({ shoeId, shoeSize, status: OrderStatus.APPROVED })
      .sort({ buyPrice: -1 }) // sort by descending order
      .exec();
  }

  public async findHighestBuyPriceSizeMap(shoeId: string) {
    return this.buyOrderRepo
      .aggregate()
      .match({
        shoeId: mongoose.Types.ObjectId(shoeId),
        status: OrderStatus.APPROVED,
      })
      .group({
        _id: "$shoeSize",
        price: { $max: "$buyPrice" },
      })
      .project({
        _id: 0,
        price: 1,
        size: "$_id",
      })
      .exec();
  }

  public updateTransactionId(buyOrderId: ObjectId, transactionId: ObjectId) {
    return this.buyOrderRepo
      .findOneAndUpdate({ _id: buyOrderId }, { transactionId })
      .exec();
  }

  public async populate(buyOrder: any): Promise<any> {
    return this.buyOrderRepo.populate(buyOrder, {
      path: "buyer shoe sellOrder transaction",
    });
  }
}
