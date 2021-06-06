import { Shoe } from "./Shoe";

export enum CatalogType {
  COLLECTION = "COLLECTION",
  REGULAR = "REGULAR",
}

export type Catalog = {
  showOnHomepagePriority: number;
  _id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description?: string;
  products: Shoe[];
  productIds: string[];
  coverImage?: string;
  catalogType: CatalogType
};
