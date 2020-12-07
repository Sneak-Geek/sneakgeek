import { District, Ward } from "../../model";

export interface ISettingService {
  getServerSettings(): Promise<Object>;
  getValidShippingAddress(token: string): Promise<{
    districts: District[],
    wards: Map<number, Ward[]>
  }>;
}