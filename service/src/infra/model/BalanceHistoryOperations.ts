//!
//! Copyright (c) 2020 - SneakGeek. All rights reserved
//!

import "reflect-metadata";
import { f } from "@marcj/marshal";

export class GetBalanceHistoryFilter {
  @f
  profileId: string;

  @f.optional()
  action: string;

  @f.optional()
  status: string;
}
