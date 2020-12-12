//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { injectable } from "inversify";
import { IPaymentService } from "./IPaymentService";
import crypto from "crypto";
import url from "url";
import { Shoe } from "../../database";

@injectable()
export class PaymentService implements IPaymentService {
  private readonly VPC_VERSION = "2";
  private readonly VPC_CURRENCY = "VND";
  private readonly VPC_COMMAND = "pay";
  private readonly VPC_ACCESS_CODE = "D67342C2";
  private readonly VPC_MERCHANT = "ONEPAY";
  private readonly VPC_LOCALE = "vn";
  private readonly VPC_CALLBACK_URL = "/api/v1/order/payment-callback";
  private readonly ONEPAY_DOMESTIC_URL = "https://mtf.onepay.vn/onecomm-pay/vpc.op";
  private readonly ONEPAY_INTERNATIONAL_URL = "https://mtf.onepay.vn/vpcpay/vpcpay.op";

  private readonly ONEPAY_DOMESTIC_HASH_KEY = "A3EFDFABA8653DF2342E8DAC29B51AF0";
  private readonly ONEPAY_INTERNATIONAL_HASH_KEY = "A3EFDFABA8653DF2342E8DAC29B51AF0";

  public generateRedirectUrl(
    paymentType: string,
    orderId: string,
    totalFee: string,
    baseCallbackUrl: string,
    shoeInfo?: Shoe
  ): string {
    const params = {
      vpc_Version: this.VPC_VERSION,
      vpc_Command: this.VPC_COMMAND,
      vpc_AccessCode: this.VPC_ACCESS_CODE,
      vpc_Merchant: this.VPC_MERCHANT,
      vpc_Currency: this.VPC_CURRENCY,
      vpc_Locale: this.VPC_LOCALE,
      vpc_ReturnURL: `${baseCallbackUrl}${this.VPC_CALLBACK_URL}`,
      vpc_MerchTxnRef: orderId,
      vpc_OrderInfo: shoeInfo ? shoeInfo.name : orderId,
      vpc_Amount: `${totalFee}00`,
      vpc_TicketNo: "127.0.0.1",
      AgainLink: "https://google.com",
      Title: "Checkout",
    };

    // set secure hash
    params["vpc_SecureHash"] = this.hashParams(paymentType, params);
    const redirectEndpoint =
      paymentType === "domestic" ? this.ONEPAY_DOMESTIC_URL : this.ONEPAY_INTERNATIONAL_URL;

    return url.format(`${redirectEndpoint}?${new url.URLSearchParams(params).toString()}`);
  }

  public hashParams(paymentType: string, params: Object) {
    const hashKey =
      paymentType === "domestic"
        ? this.ONEPAY_DOMESTIC_HASH_KEY
        : this.ONEPAY_INTERNATIONAL_HASH_KEY;
    const hashableKeys = Object.keys(params)
      .filter((t) => t.startsWith("vpc_"))
      .sort()
      .map((t) => `${t}=${params[t]}`)
      .join("&");
    const secureHash = crypto
      .createHmac("sha256", new Buffer(hashKey, "hex"))
      .update(hashableKeys)
      .digest("hex")
      .toUpperCase();

    return secureHash;
  }
}
