import { Inventory, Shoe } from "../../../model";

export type SellingInventory = {
  sellPrice: number;
  shoe: Shoe;
  stock: number;
};

export interface IInventoryService {
  getInventories(token: string, shoeName: string): Promise<(Inventory & { shoe: Shoe })[]>;
  createInventory(token: string, shoeId: string, quantity: number, sellPrice: number, shoeSize: string): Promise<void>;
  updateInventory(token: string, inventory: Inventory): Promise<Inventory>;
  getSelling(): Promise<SellingInventory[]>;
}