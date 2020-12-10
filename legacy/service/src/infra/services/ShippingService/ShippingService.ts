//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { injectable } from "inversify";
import { IShippingService, GhnDistrict, GhnWard } from "./IShippingService";
import { UserProfile } from "../../database/UserProfile";
import { AdminProfile } from "../../../assets/seeds/admin";
import path from "path";
import fs from "fs";
import { Parser } from "csv-parse";
import Q from "q";
import { BaseExternalApiService } from "../BaseExternalApiService";
import { LogProvider, EnvironmentProvider } from "../../providers";

@injectable()
export class ShippingService extends BaseExternalApiService implements IShippingService {
  // api specific constants
  private GHN_ACCESS_TOKEN = EnvironmentProvider.env.GhnAccessToken;
  private readonly GHN_CLIENT_TOKEN = EnvironmentProvider.env.GhnClientToken;
  private readonly GHN_BASE_URL = EnvironmentProvider.env.GhnBaseUrl;
  private readonly APP_HOST = EnvironmentProvider.env.Host;
  private readonly GHN_EMAIL = EnvironmentProvider.env.GhnEmail;
  private readonly GHN_PASSWORD = EnvironmentProvider.env.GhnPassword;

  // order specific constants
  private readonly PACKAGE_WEIGHT = 1000;
  private readonly PACKAGE_LENGTH = 80; // cm
  private readonly PACKAGE_WIDTH = 40; // cm
  private readonly PACKAGE_HEIGHT = 20; // cm
  private readonly SHIPPING_NOTE_CODE = "CHOXEMHANGKHONGTHU";
  private readonly SHIPPING_SERVICE_ID = 53319; // using GHN Express shipping service
  private readonly EXTERNAL_RETURN_CODE = "GHN"; // not sure what this is
  private readonly AFFILIATE_ID = 1114595; // not sure what this is

  // Caching districts and wards response
  private districts: GhnDistrict[] = [];
  private wards: Map<number, GhnWard[]> = new Map(); // map from distrcit Id to wards

  public constructor() {
    super();
  }

  public async initialze() {
    try {
      LogProvider.instance.info("[GHN] Attempt to sign in to GHN");
      await this._signIn();
    } catch (errorSignIn) {
      try {
        LogProvider.instance.info("[GHN] Attempt to sign up to GHN");
        await this._signUp();
        await this._signIn();
      } catch (errorSignUp) {
        LogProvider.instance.error(
          "[GHN] Failed to both sign up and sign in",
          JSON.stringify(errorSignIn),
          "\n",
          JSON.stringify(errorSignUp)
        );
      }
    }
  }

  private async _signIn(): Promise<void> {
    const signInData = await this.apiClient.post(`${this.GHN_BASE_URL}/SignIn`, {
      token: this.GHN_ACCESS_TOKEN,
      Email: this.GHN_EMAIL,
      Password: this.GHN_PASSWORD,
    });
    this.GHN_ACCESS_TOKEN = signInData.data.data.Token;
  }

  private _signUp(): Promise<void> {
    return this.apiClient.post(`${this.GHN_BASE_URL}/SignUp`, {
      token: this.GHN_ACCESS_TOKEN,
      Email: this.GHN_EMAIL,
      Password: this.GHN_PASSWORD,
      ContactPhone: AdminProfile.userProvidedPhoneNumber,
      ContactName: `${AdminProfile.userProvidedName.lastName} ${AdminProfile.userProvidedName.firstName}`,
    });
  }

  public async registerWebHookCallback(): Promise<void> {
    try {
      LogProvider.instance.info("[GHN] Register GHN webhook callback");
      await this.apiClient.post(
        `${this.GHN_BASE_URL}/SetConfigClient`,
        {
          token: this.GHN_ACCESS_TOKEN,
          TokenClient: [this.GHN_CLIENT_TOKEN],
          ConfigCod: false,
          ConfigReturnData: true,
          URLCallback: `${this.APP_HOST}/transaction/ghnHook`,
          ConfigField: {
            CoDAmount: false,
            CurrentWarehouseName: true,
            CustomerID: true,
            CustomerName: true,
            CustomerPhone: true,
            Note: true,
            OrderCode: true,
            ServiceName: true,
            ShippingOrderCosts: true,
            Weight: true,
            ExternalCode: true,
            ReturnInfo: true,
          },
          ConfigStatus: {
            ReadyToPick: true,
            Picking: true,
            Storing: true,
            Delivering: true,
            Delivered: true,
            WaitingToFinish: true,
            Return: true,
            Returned: true,
            Finish: true,
            LostOrder: true,
            Cancel: true,
          },
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      LogProvider.instance.error(
        "[GHN] Error registering callback",
        error.name,
        error.message,
        error.stack
      );
    }
  }

  public async createShippingOrder(
    transactionId: string,
    senderProfile: UserProfile,
    receiverProfile: UserProfile | typeof AdminProfile
  ) {
    const senderProvidedName = senderProfile.userProvidedName;
    const senderContactName = senderProvidedName.middleName
      ? `${senderProvidedName.lastName} ${senderProvidedName.middleName} ${senderProvidedName.firstName}`
      : `${senderProvidedName.lastName} ${senderProvidedName.firstName}`;
    const receiverProvidedName = receiverProfile.userProvidedName;
    const receiverContactName = receiverProvidedName.middleName
      ? `${receiverProvidedName.lastName} ${receiverProvidedName.middleName} + ${receiverProvidedName.firstName}`
      : `${receiverProvidedName.lastName} ${receiverProvidedName.firstName}`;

    const createShippingOrderParams = {
      token: this.GHN_ACCESS_TOKEN,
      FromDistrictID: senderProfile.userProvidedAddress.districtId,
      FromWardCode: senderProfile.userProvidedAddress.wardCode,
      ToDistrictID: receiverProfile.userProvidedAddress.districtId,
      ToWardCode: receiverProfile.userProvidedAddress.wardCode,
      ClientContactName: senderContactName,
      ClientContactPhone: senderProfile.userProvidedPhoneNumber,
      ClientAddress: senderProfile.userProvidedAddress.streetAddress,
      CustomerName: receiverContactName,
      CustomerPhone: receiverProfile.userProvidedPhoneNumber,
      ShippingAddress: receiverProfile.userProvidedAddress.streetAddress,
      NoteCode: this.SHIPPING_NOTE_CODE,
      ServiceID: this.SHIPPING_SERVICE_ID,
      // hard code package info
      Weight: this.PACKAGE_WEIGHT,
      Length: this.PACKAGE_LENGTH,
      Width: this.PACKAGE_WIDTH,
      Height: this.PACKAGE_HEIGHT,
      // Transaction ID
      ExternalCode: transactionId,
      // return package to sender
      ReturnContactName: senderContactName,
      ReturnContactPhone: senderProfile.userProvidedPhoneNumber,
      ReturnAddress: senderProfile.userProvidedAddress.streetAddress,
      ReturnDistrictID: senderProfile.userProvidedAddress.districtId,
      ExternalReturnCode: this.EXTERNAL_RETURN_CODE,
      // AffiliateID: this.AFFILIATE_ID,
    };

    const createShippingOrderResult = await this.apiClient.post(
      `${this.GHN_BASE_URL}/CreateOrder`,
      createShippingOrderParams
    );

    return createShippingOrderResult.data.data;
  }

  // shippingFeeTotal = shippingFeeFromSenderToSneakGeek + shippingFeeFromSneakGeekToReceiver
  public async getEstimatedTotalShippingFee(
    senderProfile: UserProfile,
    receiverProfile: UserProfile
  ): Promise<number> {
    const [
      shippingFeeFromSenderToSneakGeek,
      shippingFeeFromSneakGeekToReceiver,
    ] = await Promise.all([
      this.getEstimatedShippingFeeFromSenderToSnkg(senderProfile),
      this.getEstimatedShippingFeeFromSnkgToReceiver(receiverProfile),
    ]);

    return shippingFeeFromSenderToSneakGeek + shippingFeeFromSneakGeekToReceiver;
  }

  public async getEstimatedShippingFeeFromSenderToSnkg(senderProfile: UserProfile) {
    //const apiToken = await this._getApiToken();
    const calculateShippingFeeResult = await this.apiClient.post(
      `${this.GHN_BASE_URL}/CalculateFee`,
      {
        token: this.GHN_ACCESS_TOKEN,
        FromDistrictID: senderProfile.userProvidedAddress.districtId,
        ToDistrictID: AdminProfile.userProvidedAddress.districtId,
        ServiceID: this.SHIPPING_SERVICE_ID,
        Weight: this.PACKAGE_WEIGHT,
      }
    );

    if (calculateShippingFeeResult.data.code == 1) {
      return parseInt(calculateShippingFeeResult.data.data.CalculatedFee);
    } else {
      // this might be unnecessary
      throw new Error("Cannot calculate shipping fee");
    }
  }

  public async getEstimatedShippingFeeFromSnkgToReceiver(receiverProfile: UserProfile) {
    //const apiToken = await this._getApiToken();
    const calculateShippingFeeResult = await this.apiClient.post(
      `${this.GHN_BASE_URL}/CalculateFee`,
      {
        token: this.GHN_ACCESS_TOKEN,
        FromDistrictID: AdminProfile.userProvidedAddress.districtId,
        ToDistrictID: receiverProfile.userProvidedAddress.districtId,
        ServiceID: this.SHIPPING_SERVICE_ID,
        Weight: this.PACKAGE_WEIGHT,
      }
    );

    if (calculateShippingFeeResult.data.code == 1) {
      return parseInt(calculateShippingFeeResult.data.data.CalculatedFee);
    } else {
      // this might be unnecessary
      throw new Error("Cannot calculate shipping fee");
    }
  }

  public async getAllDistricts() {
    if (this.districts.length === 0) {
      const { data } = await this.apiClient.post(
        `${this.GHN_BASE_URL}/GetDistricts`,
        {
          token: this.GHN_ACCESS_TOKEN,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (data.code === 1) {
        this.districts = data.data as GhnDistrict[];
      } else {
        throw new Error("Cannot get districts from GHN");
      }
    }

    return this.districts;
  }

  public async getWardsByDistrict(districtId: number) {
    if (this.wards.get(districtId) === undefined) {
      const { data } = await this.apiClient.post(
        `${this.GHN_BASE_URL}/GetWards`,
        {
          token: this.GHN_ACCESS_TOKEN,
          DistrictID: districtId,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (data.code === 1) {
        this.wards.set(districtId, data.data.Wards as GhnWard[]);
      } else {
        throw new Error(`Cannot get wards by districtId ${districtId}`);
      }
    }

    return this.wards.get(districtId);
  }

  /**
   * Parse GhnDistrictWards.xls provided by Ghn and cache it
   */
  public parseGhnShippingData(): Promise<void> {
    const defer: Q.Deferred<void> = Q.defer();

    const ghnDataPath = path.resolve(
      __dirname,
      process.cwd(),
      "resources",
      "seeds",
      "GhnDistrictWards.csv"
    );
    const parser = new Parser({
      delimiter: ",",
    });

    parser.on("readable", () => {
      let row: any;
      let isHeaderParsed = false;
      while ((row = parser.read())) {
        if (!isHeaderParsed) {
          isHeaderParsed = true;
          continue;
        }

        const ProvinceName = row[0];
        const ProvinceID = parseInt(row[1], 10);
        const ProvinceCode = parseInt(row[2], 10);
        const DistrictName = row[3];
        const DistrictCode = row[4];
        const DistrictID = parseInt(row[5], 10);
        const WardName = row[6];
        const WardCode = row[8];

        const isDistrictAdded = this.districts.some((t) => t.DistrictID === DistrictID);

        if (!isDistrictAdded) {
          this.districts.push({
            ProvinceName,
            ProvinceID,
            ProvinceCode,
            DistrictID,
            DistrictName,
            Code: DistrictCode,
          } as GhnDistrict);
        }

        const wards = this.wards.get(DistrictID) || [];
        const isWardAdded = wards.some(
          (t) => t.WardCode === WardCode || t.WardName === WardName
        );
        if (!isWardAdded) {
          this.wards.set(
            DistrictID,
            wards.concat({
              WardName,
              WardCode,
              DistrictCode,
              ProvinceID,
              DistrictID,
            })
          );
        }
      }

      defer.resolve();
    });

    parser.on("error", (error) => {
      LogProvider.instance.debug(
        "[GHN] Error parsing GHN wards info",
        error.name,
        error.stack
      );
      defer.reject();
    });

    parser.on("end", () => {
      LogProvider.instance.info("[GHN] Complete parsing GHN wards/districts data");
    });

    fs.createReadStream(ghnDataPath).pipe(parser);

    // a little unsafe
    return (defer.promise as unknown) as Promise<void>;
  }

  public serializeShippingData() {
    return {
      districts: this.districts,
      wards: this.wards,
    };
  }
}