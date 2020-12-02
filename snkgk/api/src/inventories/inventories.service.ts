import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventories, InventoriesDocument } from './inventories.schema';

@Injectable()
export class InventoriesService {
  constructor(
    @InjectModel(Inventories.name)
    private inventoriesModel: Model<InventoriesDocument>
  ) {}

  async find(query: any): Promise<Inventories[]> {
    const findQuery = { shoeId: query.shoeId };
    if (query.hasOwnProperty('shoeSize')) {
      findQuery['shoeSize'] = query.shoeSize;
    }
    return this.inventoriesModel.find(findQuery).sort('sellPrice').exec();
  }

  async create(inventory: any): Promise<Inventories> {
    return this.inventoriesModel.create(inventory);
  }

  async reduceByOne(inventoryId: string): Promise<Inventories> {
    return this.inventoriesModel.findOneAndUpdate({ _id: inventoryId }, { $inc: { quantity: -1 }}).exec();
  }
}
