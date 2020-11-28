import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShoesDocument = Shoes & Document;

@Schema({ timestamps: true })
export class Shoes {
  @Prop({ required: true, type: String })
  brand: string;

  @Prop(String)
  category: string;

  @Prop([String])
  colorway: Array<string>;

  @Prop(String)
  description: string;

  @Prop(Date)
  releaseDate: Date;

  @Prop(String)
  name: string;

  @Prop(String)
  shoe: string;

  @Prop(String)
  title: string;

  @Prop(String)
  styleId: string;

  @Prop(String)
  imageUrl: string;

  @Prop([String])
  tags: Array<string>;
}

export const ShoesSchema = SchemaFactory.createForClass(Shoes);
