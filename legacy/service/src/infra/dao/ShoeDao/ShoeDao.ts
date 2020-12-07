//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { injectable, inject } from "inversify";
import { IShoeDao } from "./IShoeDao";
import { Types } from "../../../configuration/inversify";
import { Repository, Shoe } from "../../database";
import { UpdateShoeInput } from "../../model";

@injectable()
export class ShoeDao implements IShoeDao {
  @inject(Types.ShoeRepository)
  private readonly shoeRepo: Repository<Shoe>;

  public findById(_id: string | Object): Promise<Shoe> {
    return this.shoeRepo.findOne({ _id }).exec();
  }

  public async updateShoe(input: UpdateShoeInput) {
    return this.shoeRepo.findOneAndUpdate({ _id: input.shoeId }, input.getBody(), {
      new: true,
      omitUndefined: true,
    });
  }
}
