import { SellOrder } from "./SellOrder";
import { BuyOrder } from "./BuyOrder";
import { PaymentStatus, TrackingStatus } from "../assets";

export type Transaction = {
  tracking?: {
    ghnDeliverFromSellerCode: string;
    ghnDeliverToBuyerCode: string;
    trackingStatusHistory: [
      {
        status: TrackingStatus;
        expectedDeliveryDate?: Date;
      }
    ];
  };
  feeBreakdown: {
    totalFee: number;
    shippingFeeFromSellerToSnkg: number;
    shippingFeeFromSnkgToBuyer: number;
    productPrice: number;
  };
  paymentStatus: {
    status: PaymentStatus;
    message?: string;
  };
  sellOrder: string | SellOrder;
  buyOrder: string | BuyOrder;
}