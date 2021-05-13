//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { inject, injectable } from "inversify";
import { Types } from "../../../configuration/inversify";
import { Inventory, Repository } from "../../database";
import { CreateInventoryDto } from "./CreateInventoryDto";
import { IInventoryDao } from "./IInventoryDao";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

@injectable()
export class InventoryDao implements IInventoryDao {
  @inject(Types.InventoryRepository)
  private readonly inventoryRepository!: Repository<Inventory>;

  public async findById(inventoryId: string) {
    return this.inventoryRepository.findById(inventoryId).exec();
  }

  public async findByUserId(userId: string, shoeName: string) {
    return this.inventoryRepository.aggregate([
      {
        $match: {
          sellerId: mongoose.Types.ObjectId(userId),
          quantity: { $gt: 0 },
        },
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
        $unwind: { path: "$shoe" },
      },
      {
        $match: {
          "shoe.title": { $regex: shoeName, $options: "i" },
        },
      },
    ]);
  }

  public async isDuplicate(profileId: string, shoeId: string, shoeSize: string) {
    return (
      (await this.inventoryRepository
        .countDocuments({ sellerId: profileId, shoeId, shoeSize })
        .exec()) === 1
    );
  }

  public async reduceByOne(inventoryId: string) {
    return this.inventoryRepository
      .findOneAndUpdate({ _id: inventoryId }, { $inc: { quantity: -1 } })
      .exec();
  }

  public async create(inventoryDto: CreateInventoryDto) {
    return this.inventoryRepository.create({
      sellerId: mongoose.Types.ObjectId(inventoryDto.sellerId),
      shoeId: mongoose.Types.ObjectId(inventoryDto.shoeId),
      shoeSize: inventoryDto.shoeSize,
      sellPrice: inventoryDto.sellPrice,
      quantity: inventoryDto.quantity,
    });
  }

  public async getPriceBySize(shoeId: string) {
    return this.inventoryRepository
      .aggregate([
        { $match: { shoeId: mongoose.Types.ObjectId(shoeId) } },
        {
          $group: {
            _id: "$shoeSize",
            sellPrice: { $first: "$sellPrice" },
            inventoryId: { $first: "$_id" },
          },
        },
        {
          $project: {
            _id: 0,
            shoeSize: "$_id",
            sellPrice: "$sellPrice",
            inventoryId: "$inventoryId",
          },
        },
      ])
      .exec();
  }

  public async getCurrentlySelling() {
    return this.inventoryRepository
      .aggregate([
        {
          $group: {
            _id: "$shoeId",
            sellPrice: { $min: "$sellPrice" },
            stock: { $sum: 1 },
          },
        },
        {
          $match: {
            stock: { $gt: 0 },
          },
        },
        {
          $lookup: {
            from: "shoes",
            localField: "_id",
            foreignField: "_id",
            as: "shoe",
          },
        },
        {
          $unwind: { path: "$shoe" },
        },
        {
          $project: {
            _id: 0,
            shoe: 1,
            sellPrice: 1,
          },
        },
      ])
      .exec();
  }

  public async getLowestPrice(shoeId: string) {
    const lowestPrices = await this.inventoryRepository
      .find({ shoeId: mongoose.Types.ObjectId(shoeId) })
      .sort({ sellPrice: 1 })
      .limit(1)
      .exec();

    if (lowestPrices.length === 0) {
      return 0;
    }

    return lowestPrices[0].sellPrice;
  }

  public async updateInventoryWhenCreateOrder(inventoryId: string): Promise<Inventory> {
    return this.inventoryRepository.findOneAndUpdate(
      { _id: inventoryId, quantity: { $gt: 0 } },
      { $inc: { quantity: -1 } }
    );
  }

  public async getMatchingInventory(
    shoeId: string | ObjectId,
    price: number
  ): Promise<Inventory> {
    return this.inventoryRepository.findOne({
      shoeId: new ObjectId(shoeId),
      sellPrice: price,
    });
  }
}
