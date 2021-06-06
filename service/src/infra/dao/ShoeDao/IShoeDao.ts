//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Shoe } from "../../database";
import { UpdateShoeInput } from "../../model";

export interface IShoeDao {
  /**
   * Update shoe
   *
   * @param {UpdateShoeInput} input
   */
  updateShoe(input: UpdateShoeInput): Promise<Shoe>;

  findById(_id: string | Object): Promise<Shoe>;
}
