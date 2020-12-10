import { Shoe } from "../../../model";

export type SellingInventory = {
  sellPrice: number;
  shoe: Shoe;
  stock: number;
};

export interface IInventoryService {
  createInventory(token: string, shoeId: string, quantity: number, sellPrice: number, shoeSize: string): Promise<void>;
  getSelling(): Promise<SellingInventory[]>;
}