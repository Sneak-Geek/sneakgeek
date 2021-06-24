//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { ObjectId } from "mongodb";
import { Inventory, Shoe } from "../../database";
import { CreateInventoryDto } from "./CreateInventoryDto";

export type PriceSizeAgg = {
  shoeSize: string;
  sellPrice: number;
  inventoryId: number;
};

export type CurrentlySellData = {
  stock: number;
  sellPrice: number;
  shoe: Shoe;
};

export type InventorySearchResult = {
  shoeId: ObjectId;
  sellPrice: number;
  shoe: Shoe;
  quantity: number;
};

export interface IInventoryDao {
  findById(inventoryId: string): Promise<Inventory>;
  findByUserId(
    userId: string,
    shoeName: string
  ): Promise<Array<Inventory & { shoe: Shoe }>>;
  isDuplicate(profileId: string, shoeId: string, shoeSize: string): Promise<boolean>;
  reduceByOne(inventoryId: string): Promise<Inventory>;
  create(inventoryDto: CreateInventoryDto): Promise<Inventory>;
  getPriceBySize(shoeId: string): Promise<PriceSizeAgg>;
  getCurrentlySelling(): Promise<CurrentlySellData>;
  getLowestPrice(shoeId: string): Promise<number>;
  updateInventoryWhenCreateOrder(inventoryId: string): Promise<Inventory>;
  getMatchingInventory(shoeId: string | ObjectId, price: number): Promise<Inventory>;
  findShoeInventoryWithPrice(page: number, title: string): Promise<InventorySearchResult[]>;
}
