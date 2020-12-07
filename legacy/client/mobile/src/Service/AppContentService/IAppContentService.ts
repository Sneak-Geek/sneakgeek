//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Shoe } from "../../Shared/Model";

export interface IAppContentService {
  getShoes(): Promise<Shoe[]>;
  searchShoes(key: string): Promise<Shoe[]>;
  getShoesByIds(token: string, ids: string[]): Promise<Shoe[]>;
  requestProduct(title: string, brand: string): Promise<any>;
}
