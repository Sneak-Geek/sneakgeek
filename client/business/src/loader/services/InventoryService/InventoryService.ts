import { Inventory } from "../../../model";
import { BaseService } from "../BaseService";
import { IInventoryService } from "./IInventoryService";

export class InventoryService extends BaseService implements IInventoryService {
  public async getInventories(token: string, shoeName: string) {
    const { data } = await this.apiClient.getInstance().get(
      `/inventory?shoeName=${shoeName}`,
      { headers: { authorization: token } }
    );
    return data;
  }

  public async createInventory(token: string, shoeId: string, quantity: number, sellPrice: number, shoeSize: string): Promise<void> {
    return await this.apiClient.getInstance().post(
      '/inventory/new',
      { shoeId, quantity, sellPrice, shoeSize },
      { headers: { authorization: token } }
    )
  }

  public async updateInventory(token: string, inventory: Inventory) {
    alert(inventory.id);
    const { data } = await this.apiClient.getInstance().put(
      '/inventory/update',
      inventory,
      { headers: { authorization: token } }
    )
    return data;
  }

  public async getSelling() {
    const { data } = await this.apiClient.getInstance().get("/inventory/selling");

    return data;
  }

  public async getLowestSellPrice(shoeId: string) {
    const { data } = await this.apiClient.getInstance().get(`/inventory/lowest?shoeId=${shoeId}`);

    return data.price;
  }
}