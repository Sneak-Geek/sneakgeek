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

  @Prop({
    type: {
      gallery: [String],
      imageUrl: String,
      thumbUrl: String,
      smallImageUrl: String,
      hidden: Boolean,
    },
  })
  media: string;

  @Prop({ type: Number })
  retailPrice: number;

  @Prop({ type: String, enum: ['men', 'women'] })
  gender: string;

  @Prop({ type: String })
  stockxId: string;

  @Prop({ type: String })
  urlKey: string;

  @Prop({ type: Number })
  year: number;

  @Prop({ type: [String] })
  tags?: Array<string>;
}

export const ShoesSchema = SchemaFactory.createForClass(Shoes);
