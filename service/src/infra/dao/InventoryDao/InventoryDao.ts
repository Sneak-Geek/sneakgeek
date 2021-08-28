//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { inject, injectable } from "inversify";
import { Types } from "../../../configuration/inversify";
import { Inventory, Repository, Shoe } from "../../database";
import { CreateInventoryDto } from "./CreateInventoryDto";
import { IInventoryDao, InventorySearchResult } from "./IInventoryDao";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

@injectable()
export class InventoryDao implements IInventoryDao {
  @inject(Types.InventoryRepository)
  private readonly inventoryRepository!: Repository<Inventory>;

  @inject(Types.ShoeRepository)
  private readonly shoeRepository!: Repository<Shoe>;

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
    const shoe: Shoe = await this.shoeRepository
      .findOne({
        _id: mongoose.Types.ObjectId(inventoryDto.shoeId),
      })
      .exec();

    return this.inventoryRepository.create({
      sellerId: mongoose.Types.ObjectId(inventoryDto.sellerId),
      shoeId: mongoose.Types.ObjectId(inventoryDto.shoeId),
      shoeSize: inventoryDto.shoeSize,
      sellPrice: inventoryDto.sellPrice,
      quantity: inventoryDto.quantity,
      shoeInfo: {
        title: shoe.title,
        brand: shoe.brand,
        category: shoe.category,
        gender: shoe.gender,
        name: shoe.name,
        thumbnail: shoe.media?.thumbUrl,
      },
    });
  }

  public async getPriceBySize(shoeId: string) {
    return this.inventoryRepository
      .aggregate([
        {
          $match: {
            shoeId: mongoose.Types.ObjectId(shoeId),
            quantity: { $gt: 0 },
          },
        },
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
    // TO DO: quantity of an individual seller can be 0 => return error when create order.
    return this.inventoryRepository
      .aggregate([
        {
          $group: {
            _id: "$shoeId",
            sellPrice: { $min: "$sellPrice" },
            stock: { $sum: 1 },
            quantity: { $sum: "$quantity" },
          },
        },
        {
          $match: {
            stock: { $gt: 0 },
            quantity: { $gt: 0 },
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

  public async findShoeInventoryWithPrice(
    page: number,
    title: string,
    brands?: Array<string>,
    gender?: string
  ): Promise<InventorySearchResult[]> {
    const pageSize = 20;
    const matchQuery: Array<any> = [
      {
        "shoeInfo.title": { $regex: new RegExp(`${title}`, "i") },
      },
    ];
    if (brands && brands.length > 0) {
      matchQuery.push({ "shoeInfo.brand": { $in: brands } });
    }
    if (gender) {
      matchQuery.push({ "shoeInfo.gender": gender });
    }
    const query: any[] = [
      {
        $match: { $and: matchQuery },
      },
      {
        $group: {
          _id: "$shoeId",
          sellPrice: { $min: "$sellPrice" },
          quantity: { $sum: "$quantity" },
        },
      },
      {
        $match: {
          quantity: { $gt: 0 },
        },
      },
      {
        $limit: pageSize,
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
          shoeId: "$_id",
          sellPrice: 1,
          quantity: 1,
          shoe: 1,
        },
      },
    ];

    if (page > 0) {
      query.splice(3, 0, {
        $skip: pageSize * page,
      });
    }

    return this.inventoryRepository.aggregate(query);
  }

  public async deleteInventory(profileId: string, inventoryId: string): Promise<void> {
    this.inventoryRepository
      .findOneAndDelete({ sellerId: profileId, _id: inventoryId })
      .exec();
  }
}
