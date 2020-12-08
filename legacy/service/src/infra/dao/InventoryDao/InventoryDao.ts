//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { inject, injectable } from "inversify";
import { Types } from "../../../configuration/inversify";
import { Inventory, Repository } from "../../database";
import { IInventoryDao } from "./IInventoryDao";

@injectable()
export class InventoryDao implements IInventoryDao {
  @inject(Types.InventoryRepository)
  private readonly inventoryRepository!: Repository<Inventory>;

  public async findById(inventoryId: string) {
    return this.inventoryRepository.findById(inventoryId).exec();
  }

  public async reduceByOne(inventoryId: string) {
    return this.inventoryRepository
      .findOneAndUpdate({ _id: inventoryId }, { $inc: { quantity: -1 } })
      .exec();
  }
}
