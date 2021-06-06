// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { SellOrder, Transaction, BuyOrder } from "../../Shared/Model";

export interface ITransactionService {
  sellShoe(token: string, shoeOrder: Transaction): Promise<void>;
  buyShoe(token: string, soldPrice: number, sellOrderId: string): Promise<void>;
  getSellingHistory(token: string): Promise<{ sellHistory: SellOrder[] }>;
  getBuyHistory(token: string): Promise<{ buyHistory: BuyOrder[] }>;
  getAvailableOrders(token: string, shoeId: string): Promise<SellOrder[]>;
  processPaymentIntl(sellOrder: SellOrder, buyerId: string): string;
  processPaymentDomestic(sellOrder: SellOrder, buyerId: string): string;
}
