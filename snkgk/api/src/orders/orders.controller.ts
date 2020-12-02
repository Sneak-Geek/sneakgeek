import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdersService } from './orders.service'; 
import { CreateOrderInput } from './orders.dto';
import { InventoriesService } from '../inventories/inventories.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService, private inventoriesService: InventoriesService) {}

  @Post('new')
  async createOrders(@Body() createOrderInput: CreateOrderInput) {
    const [_, order] = await Promise.all([
      this.inventoriesService.reduceByOne(createOrderInput.inventoryId),
      this.ordersService.create({ ...createOrderInput, buyerId: 'buyer1' })
    ]);
    return order;
  }
}
