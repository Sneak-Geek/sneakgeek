// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { SellOrder } from ".";

export function getLatestPrice(s: SellOrder) {
  return (
    s.priceHistory?.sort((x, y) => new Date(y.updatedAt).getTime() - new Date(x.updatedAt).getTime())[0].price || 0
  );
}
