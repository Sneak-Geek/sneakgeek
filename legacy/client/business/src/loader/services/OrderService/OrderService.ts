import { IOrderService, PaymentType, OrderType, SellOrderEditInput } from "./IOrderService";
import { BaseService } from "../BaseService";
import {
  SellOrder,
  PopulatedSellOrder,
  PopulatedBuyOrder,
  Transaction
} from "../../../model";

export class OrderService extends BaseService implements IOrderService {
  public async createSellOrder(token: string, sellOrder: SellOrder): Promise<void> {
    const response = await this.apiClient.getInstance().post(`/order/sell-order/new`, {
      shoeId: sellOrder.shoeId,
      shoeSize: sellOrder.shoeSize,
      sellPrice: sellOrder.sellPrice,
      productCondition: sellOrder.productCondition,
      pictures: sellOrder.pictures,
      isNewShoe: sellOrder.isNewShoe
    }, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }


  public async getPriceSizeMap(token: string, shoeId: string) {
    const response = await this.apiClient.getInstance().get(`/order/shoe-price-size-map?shoeId=${shoeId}`, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }

  public async getTotalFee(token: string, sellOrderId: string): Promise<{ shippingFee: number, shoePrice: number }> {
    const response = await this.apiClient.getInstance().get(
      `/order/get-total-fee?sellOrderId=${sellOrderId}`,
      {
        headers: {
          authorization: token
        }
      }
    );

    return response.data;
  }

  public async getCheckoutUrlForPurchase(token: string, paymentType: PaymentType, inventoryId: string): Promise<string> {
    let url = `/order/pay?paymentType=${paymentType}&inventoryId=${inventoryId}`;

    const response = await this.apiClient.getInstance().get(
      url,
      {
        headers: {
          authorization: token
        }
      }
    );

    return response.data;
  }

  public async getUserPopulatedOrders(token: string, type: OrderType): Promise<Array<PopulatedBuyOrder> | Array<PopulatedSellOrder>> {
    const response = await this.apiClient.getInstance().get(`/order?orderType=${type}`, {
      headers: {
        authorization: token
      }
    });

    return response.data.orders;
  }

  public async getTransactionBySellOrder(token: string, sellOrderId: string): Promise<Transaction> {
    const response = await this.apiClient.getInstance().get(`/transaction/my?sellOrderId=${sellOrderId}`, {
      headers: {
        authorization: token
      }
    });

    return response.data.transaction;
  }

  public async getLowestSellOrderAndHighestBuyOrder(token: string, shoeId: string, shoeSize: string) {
    const queryUrl = `/order/lowest-sell-order-and-highest-buy-order?shoeId=${shoeId}&shoeSize=${shoeSize}`;

    const response = await this.apiClient.getInstance().get(queryUrl, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }

  public async createBuyOrder(token: string, inventoryId: string) {
    const response = await this.apiClient.getInstance().post(`/order/new`,
      {
        inventoryId
      },
      {
        headers: {
          authorization: token
        }
      }
    );

    return response.data;
  }

  public async updateSellOrder(token: string, order: SellOrderEditInput): Promise<void> {
    const response = await this.apiClient.getInstance().put(`/order/sell-order/update`, order, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }

  public async cancelSellOrder(token: string, orderId: string): Promise<void> {
    const response = await this.apiClient.getInstance().put(`/order/sell-order/cancel?orderId=${orderId}`, null, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }

  public async getPopulatedSellOrderById(token: string, orderId: string): Promise<PopulatedSellOrder> {
    const response = await this.apiClient.getInstance().get(`/order/sell-order/${orderId}`, {
      headers: {
        authorization: token
      }
    });

    return response.data;
  }
}