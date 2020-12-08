//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Inventory } from "../../database";

export interface IInventoryDao {
  findById(inventoryId: string): Promise<Inventory>;
  reduceByOne(inventoryId: string): Promise<Inventory>;
}
