import { IPaymentService } from "../../../src/infra/services";
import { injectable } from "inversify";

@injectable()
export class PaymentServiceMock implements IPaymentService {
  generateRedirectUrl(
    transactionType: "intl" | "domestic",
    orderInfo: string,
    transactionId: string,
    totalFee: string,
    baseCallbackUrl: string
  ): string {
    throw new Error("Method not implemented.");
  }

  hashParams(paymentType: "intl" | "domestic", params: Object): string {
    throw new Error("Method not implemented.");
  }
}
