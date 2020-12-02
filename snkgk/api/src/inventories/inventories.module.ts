import { Module } from '@nestjs/common';
import { InventoriesService } from './inventories.service';
import { InventoriesController } from './inventories.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventories, InventoriesSchema } from './inventories.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Inventories.name, schema: InventoriesSchema }]),
  ],
  providers: [InventoriesService],
  controllers: [InventoriesController]
})
export class InventoriesModule {}
