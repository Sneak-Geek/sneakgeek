import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { CreateInventoryInput, FindInventoryInput } from './inventories.dto';

@Controller('inventories')
export class InventoriesController {
  constructor(private inventoriesService: InventoriesService) {}

  @Get('find')
  async findInventories(@Query() findInventoryInput: FindInventoryInput) {
    return await this.inventoriesService.find(findInventoryInput);
  }

  @Post('new')
  async createInventories(@Body() createInventoryInput: CreateInventoryInput) {
    const inventory = { ...createInventoryInput, sellerId: 'seller1' };
    return await this.inventoriesService.create(inventory);
  }
}