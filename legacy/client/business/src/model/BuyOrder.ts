import { OrderStatus } from "../assets";
import { Shoe } from "./Shoe";
import { Profile } from "./Profile";
import { SellOrder } from "./SellOrder";
import { Transaction } from "./Transaction";

export type BuyOrder = {
  _id: string,
  buyerId: string,
  shoeId: string,
  shoeSize: string,
  isNewShoe: boolean,
  buyPrice: number, 
  sellOrderId?: string,
  status: OrderStatus,
  transactionId?: string
}

export type PopulatedBuyOrder = BuyOrder & {
  buyer: Profile,
  shoe: Shoe,
  sellOrder?: SellOrder,
  transaction?: Transaction,
}