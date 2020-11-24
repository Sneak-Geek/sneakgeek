import { ISettingService } from "../interfaces";
import { BaseService } from "./BaseService";
import { District, Ward } from "../../model";

export class SettingService extends BaseService implements ISettingService {
  public async getServerSettings(): Promise<Object> {
    const response = await this.apiClient.getInstance().get('/settings');

    return response.data;
  }

  public async getValidShippingAddress(token: string): Promise<{
    districts: District[],
    wards: Map<number, Ward[]>
  }> {
    const response = await this.apiClient.getInstance().get('/settings/shipping', {
      headers: {
        authorization: token
      }
    });

    const { districts, wards } = response.data;

    return {
      districts,
      wards: new Map(JSON.parse(wards))
    };
  }
}