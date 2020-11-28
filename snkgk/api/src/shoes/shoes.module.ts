import { Module } from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { ShoesController } from './shoes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shoes, ShoesSchema } from './shoes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shoes.name, schema: ShoesSchema }]),
  ],
  providers: [ShoesService],
  controllers: [ShoesController],
  exports: [MongooseModule],
})
export class ShoesModule {}
