export type Order = {
  _id: string;
  buyerId: string;
  inventoryId: string;
  status: string;
  shippingAddress: {
    addressLine1: string;
    addressLine2: string;
  };
}