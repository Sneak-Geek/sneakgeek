import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema } from './orders.schema';
import { InventoriesService } from '../inventories/inventories.service';
import { Inventories, InventoriesSchema } from '../inventories/inventories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Orders.name, schema: OrdersSchema }, { name: Inventories.name, schema: InventoriesSchema }]),
  ],
  providers: [OrdersService, InventoriesService],
  controllers: [OrdersController]
})
export class OrdersModule {}
