export type FindInventoryInput = {
  shoeId: string,
  shoeSize?: string
}

export type CreateInventoryInput = {
  shoeId: string,
  shoeSize: string,
  quantity: number,
  sellPrice: number,
};