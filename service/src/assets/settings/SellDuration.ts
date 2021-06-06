//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Strings } from "..";

export interface SellDuration {
  duration: number;
  unit: string;
}

export const SellDurationSettings: SellDuration[] = [
  { duration: 24, unit: Strings.SellOrder_Unit_Hour },
  { duration: 48, unit: Strings.SellOrder_Unit_Hour },
  { duration: 72, unit: Strings.SellOrder_Unit_Hour },
  { duration: 7, unit: Strings.SellOrder_Unit_Day },
  { duration: 1, unit: Strings.SellOrder_Unit_Month },
];
