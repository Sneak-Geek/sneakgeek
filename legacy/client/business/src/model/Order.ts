import { TrackingStatus } from "../assets/constants";

export type Order = {
  _id: string;
  buyerId: string;
  inventoryId: string;
  status: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
  };
  trackingStatus: [
    {
      status: TrackingStatus;
      date: Date;
    }
  ];
}