//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

import "reflect-metadata";
import { f } from "@marcj/marshal";

export class UpdateShoeInput {
  @f
  shoeId: string;

  // elasticsearch id
  @f
  shoeEsId: string;

  @f.optional()
  title?: string;

  @f.optional()
  brand?: string;

  @f.optional()
  category?: string;

  @f.optional()
  retailPrice?: number;

  @f.optional()
  releaseDate?: Date;

  @f.optional()
  description?: string;

  getBody() {
    const body = Object.assign({}, this);
    delete body.shoeId;
    delete body.shoeEsId;
    return body;
  }
}
