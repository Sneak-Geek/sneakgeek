//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

import { Shoe } from "../../database";

export interface IBootstrapProvider {
  getRawShoesData: () => Partial<Shoe>[];
  bootstrapUsersData: () => Promise<any>;
  bootstrapShoesData: () => Promise<any>;
  bootstrapCatalogData: () => Promise<any>;
  bootstrapShippingService: () => Promise<any>;
}
