import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShoesDocument = Shoes & Document;

@Schema({ timestamps: true })
export class Shoes {
  @Prop({ type: String, require: true })
  brand: string;

  @Prop({ type: String })
  category: string;

  @Prop({ type: [String] })
  colorway?: Array<string>;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: Date })
  releaseDate: Date;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  styleId: string;

  @Prop({ type: String })
  imageUrl: string;

  @Prop({ type: [String] })
  tags?: Array<string>;
}

export const ShoesSchema = SchemaFactory.createForClass(Shoes);
