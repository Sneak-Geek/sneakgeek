export interface Shoe {
  _id: string;
  esId?: string;
  brand: string;
  category: string;
  colorway: string[];
  name: string;
  description?: string;
  media: {
    thumbUrl: string;
    imageUrl: string;
  };
  shoe: string;
  urlKey: string;
  title: string;
  retailPrice?: number;
  releaseDate?: string;
  gender: "men" | "women" | "preschool" | "toddler" | "child";
}
