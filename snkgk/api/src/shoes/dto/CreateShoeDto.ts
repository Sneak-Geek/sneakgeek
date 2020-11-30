export type CreateShoeDto = {
  _id: { $oid: string };
  brand: string;
  category: string;
  colorway: Array<string>;
  description?: string;
  gender: string;
  releaseDate: { $date: string };
  retailPrice: number | string;
  name: string;
  styleId: string;
  imageUrl: string;
  title?: string;
};
