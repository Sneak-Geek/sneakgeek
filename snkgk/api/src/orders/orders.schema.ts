import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrdersDocument = Orders & Document;

@Schema({ timestamps: true })
export class Orders {
  @Prop({ type: String, required: true})
  inventoryId: string;

  @Prop({ type: String, required: true})
  buyerId: string;
}

export const OrdersSchema = SchemaFactory.createForClass(Orders);