//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

export interface IPaymentService {
  generateRedirectUrl(
    paymentType: string,
    orderId: string,
    totalFee: string,
    baseCallbackUrl: string
  ): string;

  hashParams(paymentType: "intl" | "domestic", params: Object): string;
}
