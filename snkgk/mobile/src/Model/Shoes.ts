export type Shoes = {
  brand: string;
  category: string;
  colorway?: Array<string>;
  description?: string;
  releaseDate: Date;
  name: string;
  title: string;
  styleId: string;
  media: {
    gallery: [String];
    imageUrl: string;
    thumbUrl: string;
    smallImageUrl: string;
    hidden: Boolean;
  };
  retailPrice: number;
  gender: string;
  stockxId: string;
  urlKey: string;
  year: number;
  tags?: Array<string>;
};
