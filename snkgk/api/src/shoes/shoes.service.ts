import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateShoeDto } from './dto/CreateShoeDto';
import { Shoes, ShoesDocument } from './shoes.schema';

@Injectable()
export class ShoesService {
  constructor(
    @InjectModel(Shoes.name)
    private shoesModel: Model<ShoesDocument>,
  ) {}

  async getTotalCount() {
    return this.shoesModel.countDocuments().exec();
  }

  async create(shoeDto: CreateShoeDto): Promise<Shoes> {
    return this.shoesModel.create({
      ...shoeDto,
      _id: Types.ObjectId(shoeDto._id.$oid),
      releaseDate: shoeDto.releaseDate.$date,
      title: shoeDto.title ?? '',
    });
  }

  async createMany(shoeDtos: Array<CreateShoeDto>): Promise<ShoesDocument[]> {
    const result = await this.shoesModel.insertMany(
      shoeDtos.map((shoe) => ({
        _id: Types.ObjectId(shoe._id['$oid']),
        brand: shoe.brand,
        category: shoe.category,
        colorway: shoe.colorway,
        description: shoe.description,
        gender: shoe.gender,
        releaseDate: new Date(shoe.releaseDate['$date']),
        name: shoe.name,
        styleId: shoe.styleId,
        imageUrl: shoe.imageUrl?.trim(),
        title: shoe.title,
      })),
      { ordered: false, rawResult: false },
    );

    return result;
  }
}
