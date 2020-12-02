import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InventoriesDocument = Inventories & Document;

@Schema({ timestamps: true })
export class Inventories {
  @Prop({ type: String, required: true })
  shoeId: string;

  @Prop({ type: String, required: true })
  sellerId: string;

  @Prop({ type: String, required: true })
  shoeSize: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: Number, required: true })
  sellPrice: number;
}

export const InventoriesSchema = SchemaFactory.createForClass(Inventories);