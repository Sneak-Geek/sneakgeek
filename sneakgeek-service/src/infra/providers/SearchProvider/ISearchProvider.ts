import { Shoe } from "../../database";
import { UpdateShoeInput } from "../../model";

export interface ISearchProvider {
  isPopulated(): Promise<boolean>;
  initialize(): Promise<void>;
  indexShoes(shoes: Partial<Shoe>[]): Promise<void>;
  search(
    page: number,
    size: number,
    title: string,
    brand?: string[],
    gender?: string
  ): Promise<{ count: number; shoes: Shoe[] }>;
  updateShoe(updateInput: UpdateShoeInput): Promise<void>;
}
