import { Shoe } from "./Shoe";

export type Inventory = {
  _id: string;
  id?: string;
  sellerId: string;
  shoeId: string;
  shoeSize: string;
  sellPrice: number;
  quantity: number;
  shoe?: Shoe;
};