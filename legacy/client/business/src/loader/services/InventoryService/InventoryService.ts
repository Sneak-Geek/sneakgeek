import { BaseService } from "../BaseService";
import { IInventoryService } from "./IInventoryService";

export class InventoryService extends BaseService implements IInventoryService {
  public async createInventory(token: string, shoeId: string, quantity: number, sellPrice: number, shoeSize: string): Promise<void> {
    return await this.apiClient.getInstance().post(
      '/inventory/new',
      { shoeId, quantity, sellPrice, shoeSize },
      { headers: { authorization: token } }
    )
  }

  public async getSelling() {
    const { data } = await this.apiClient.getInstance().get("/inventory/selling");

    return data;
  }
}