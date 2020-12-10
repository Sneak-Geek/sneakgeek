//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Shoe } from "../../database";

export interface IPaymentService {
  generateRedirectUrl(
    paymentType: string,
    orderId: string,
    totalFee: string,
    baseCallbackUrl: string
    shoeInfo?: Shoe
  ): string;

  hashParams(paymentType: "intl" | "domestic", params: Object): string;
}
