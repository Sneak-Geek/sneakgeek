//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { UserProfile } from "../../database/UserProfile";
import { AdminProfile } from "../../../assets/seeds/user";

export interface GhnDistrict {
  Code: string; // district code
  DistrictID: number;
  DistrictName: string;
  ProvinceID: number;
  ProvinceName: string;
  ProvinceCode: number;
}

export interface GhnWard {
  WardCode: string;
  WardName: string;
  DistrictCode: string;
  ProvinceID: number;
  DistrictID: number;
}

export type GhnStatus =
  | "ReadyToPick"
  | "Picking"
  | "Storing"
  | "Delivering"
  | "Delivered"
  | "Return"
  | "Returned"
  | "WaitingToFinish"
  | "Finish"
  | "Cancel"
  | "LostOrder";

export interface GhnWebhookCallbackDataType {
  CodAmount: number;
  CurrentStatus: string;
  CurrentWarehouseName: string;
  CustomerID: number;
  CustomerName: string;
  CustomerPhone: number;
  ExternalCode: GhnStatus;
  Note: string;
  OrderCode: string;
  ReturnInfo: string;
  ServiceName: string;
  ShippingOrderCosts: Array<{
    Cost: number;
    PaymentChannelID: number;
    ServiceName: string;
    ServiceType: number;
    ShippingOrderID: number;
  }>;
  Weight: number;
}

export interface IShippingService {
  initialze(): Promise<void>;
  registerWebHookCallback(): Promise<void>;
  getEstimatedTotalShippingFee(
    senderProfile: UserProfile,
    receiverProfile: UserProfile
  ): Promise<number>;
  createShippingOrder(
    transactionId: string,
    senderProfile: UserProfile,
    receiverProfile: UserProfile | typeof AdminProfile
  );
  getEstimatedShippingFeeFromSenderToSnkg(senderProfile: UserProfile): Promise<number>;
  getEstimatedShippingFeeFromSnkgToReceiver(receiverProfile: UserProfile): Promise<number>;
  getAllDistricts(): Promise<GhnDistrict[]>;
  getWardsByDistrict(districtId: number): Promise<GhnWard[]>;
  parseGhnShippingData(): Promise<void>;
  serializeShippingData(): {
    districts: GhnDistrict[];
    wards: Map<number, GhnWard[]>;
  };
}
