import {
  SellOrder,
  BuyOrder,
  Transaction,
  PopulatedSellOrder,
  PopulatedBuyOrder
} from "../../../model";

export type PaymentType = "intl" | "domestic";
export type OrderType = "BuyOrder" | "SellOrder";
export type SellOrderEditInput = {
  orderId: string;
  sellPrice?: number;
  productCondition?: {
    isTainted?: boolean;
    isOutsoleWorn?: boolean;
    isTorn?: boolean;
    otherDetail?: boolean;
  };
};

export interface IOrderService {
  createSellOrder(token: string, sellOrder: SellOrder): Promise<void>;
  createBuyOrder(token: string, buyOrder: Partial<BuyOrder>): Promise<void>;
  getPriceSizeMap: (token: string, orderType: OrderType, shoeId: string) => Promise<{ price: number, size: string }[]>;
  getTotalFee: (token: string, sellOrderId: string) => Promise<{ shippingFee: number, shoePrice: number }>;
  getCheckoutUrlForPurchase: (token: string, paymentType: PaymentType, sellOrderId: string, buyOrderId?: string) => Promise<string>;
  getUserPopulatedOrders: (token: string, type: OrderType) => Promise<Array<PopulatedBuyOrder> | Array<PopulatedSellOrder>>;
  getTransactionBySellOrder: (token: string, sellOrderId: string) => Promise<Transaction>;
  getLowestSellOrderAndHighestBuyOrder(token: string, shoeId: string, shoeSize: string): Promise<{
    lowestSellOrder?: SellOrder;
    highestBuyOrder?: BuyOrder;
  }>;
  updateSellOrder: (token: string, order: SellOrderEditInput) => Promise<void>;
  cancelSellOrder: (token: string, orderId: string) => Promise<void>;
  getPopulatedSellOrderById: (token: string, orderId: string) => Promise<PopulatedSellOrder>;
}