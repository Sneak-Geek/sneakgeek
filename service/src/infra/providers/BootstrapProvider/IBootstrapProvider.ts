//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

import { Shoe } from "../../database";

export interface IBootstrapProvider {
  getRawShoesData: () => Partial<Shoe>[];
  bootstrapProdUserData: () => Promise<any>;
  bootstrapDevUserData: () => Promise<any>;
  bootstrapShoesData: () => Promise<any>;
  bootstrapCatalogData: () => Promise<any>;
  bootstrapDevInventoryAndOrder: () => Promise<void>;
  bootstrapProdInventory: () => Promise<void>;
}
