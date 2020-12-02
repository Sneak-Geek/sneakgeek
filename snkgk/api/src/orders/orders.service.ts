import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Orders, OrdersDocument } from './orders.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Orders.name)
    private ordersModel: Model<OrdersDocument>
  ) {}

  async findByBuyerId(buyerId: string): Promise<Orders[]> {
    return this.ordersModel.find({ buyerId }).sort('-createdAt').exec();
  }

  async create(order: any): Promise<Orders> {
    return this.ordersModel.create(order);
  }
}
