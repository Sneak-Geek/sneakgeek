import { OrderStatus } from "../assets";
import { Profile } from "./Profile";
import { Shoe } from "./Shoe";
import { Transaction } from "./Transaction";

export type SellOrder = {
  _id?: string,
  id?: string,
  sellerId: string,
  shoeId: string,
  shoeSize: string,
  isNewShoe: boolean,
  sellPrice: number,
  productCondition?: {
    boxCondition?: string,
    isTainted?: boolean,
    isOutsoleWorn?: boolean,
    isInsoleWorn?: boolean,
    isTorn?: boolean,
    otherDetail?: string
  },
  status: OrderStatus,
  pictures?: Array<string>,
  isDeleted?: boolean
}

export type PopulatedSellOrder = SellOrder & {
  seller: Profile,
  shoe: Shoe,
  transaction: Transaction
}