import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryCursor } from 'mongoose';
import { Shoes, ShoesDocument } from './shoes.schema';

@Injectable()
export class ShoesService {
  constructor(
    @InjectModel(Shoes.name)
    private shoesModel: Model<ShoesDocument>,
  ) {}

  async getTotalCount() {
    return this.shoesModel.countDocuments().exec();
  }

  async getAllByCursor(): Promise<QueryCursor<ShoesDocument>> {
    return this.shoesModel.find().cursor();
  }
}
