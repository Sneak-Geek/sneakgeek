//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Inventory } from "../../database";
import { CreateInventoryDto } from "./CreateInventoryDto";

export type PriceSizeAgg = { 
  shoeSize: string; 
  sellPrice: number;
  inventoryId: number;
};

export interface IInventoryDao {
  findById(inventoryId: string): Promise<Inventory>;
  isDuplicate(profileId: string, shoeId: string, shoeSize: string): Promise<boolean>;
  reduceByOne(inventoryId: string): Promise<Inventory>;
  create(inventoryDto: CreateInventoryDto): Promise<Inventory>;
  getPriceBySize(shoeId: string): Promise<PriceSizeAgg>;
}
