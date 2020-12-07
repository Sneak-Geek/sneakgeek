// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !
import { ITransactionService } from "./ITransactionService";
import { getLatestPrice, SellOrder, Transaction, BuyOrder } from "../../Shared/Model";
import ApiClient, { baseUrl } from "../ApiClient";
import * as HttpStatus from "http-status";
import { injectable } from "inversify";

@injectable()
export class TransactionService implements ITransactionService {
  public async /** override */ sellShoe(token: string, shoeOrder: Transaction): Promise<any> {
    const headers = { authorization: token };
    const result = await ApiClient.post("/transaction/sell/new", shoeOrder, { headers });
    if (result && result.status === HttpStatus.CREATED) {
      return result.data;
    }

    return undefined;
  }

  public async buyShoe(token: string, soldPrice: number, sellOrderId: string) {
    const headers = { authorization: token };
    const result = await ApiClient.post("/transaction/buy/new", { soldPrice, sellOrderId }, { headers });

    return result.data;
  }

  public async /** override */ getSellingHistory(token: string): Promise<{ sellHistory: SellOrder[] }> {
    const headers = { authorization: token };
    const result = await ApiClient.get("/transaction/sell/all", { headers });
    if (result && result.status === HttpStatus.OK) {
      return result.data;
    }

    return { sellHistory: [] };
  }

  public async /** override */ getBuyHistory(token: string): Promise<{ buyHistory: BuyOrder[] }> {
    const headers = { authorization: token };
    const result = await ApiClient.get("/transaction/buy/all", { headers });
    if (result) {
      return result.data;
    }

    return { buyHistory: [] };
  }

  public /** override */ processPaymentIntl(sellOrder: SellOrder, buyerId: string): string {
    const soldPrice = getLatestPrice(sellOrder);
    const url = `${baseUrl}/transaction/buy?type=intl&orderId=${sellOrder._id}&buyerId=${buyerId}&soldPrice=${soldPrice}`;

    return url;
  }

  public /** override */ processPaymentDomestic(sellOrder: SellOrder, buyerId: string): string {
    const soldPrice = getLatestPrice(sellOrder);
    const url = `${baseUrl}/transaction/buy?type=domestic&orderId=${sellOrder._id}&buyerId=${buyerId}&soldPrice=${soldPrice}`;

    return url;
  }

  public async /** override */ getAvailableOrders(token: string, shoeId: string): Promise<SellOrder[]> {
    const headers = { authorization: token };

    const result = await ApiClient.get(`/transaction/orders?type=sell&shoeId=${shoeId}`, { headers });
    if (result && result.status === HttpStatus.OK) {
      return result.data.orders;
    }

    return [];
  }
}
