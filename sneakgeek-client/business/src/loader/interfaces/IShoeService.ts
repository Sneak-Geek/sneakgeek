import { Shoe, Review, SellOrder, BuyOrder } from "../../model";

export interface IShoeService {
  searchShoes: (
    key: string,
    page: number,
    gender?: string,
    brand?: string[]
  ) => Promise<{ count: number; shoes: Shoe[] }>;
  getShoeReviews: (shoeId: string) => Promise<Review[]>;
  addReview: (token: string, review: Review) => Promise<void>;
  getShoeInfo: (
    shoeId: string
  ) => Promise<{
    relatedShoes: Shoe[];
    lowestSellOrder?: SellOrder;
    highestBuyOrder?: BuyOrder;
  }>;
  getReviewStats: (shoeId: string) => Promise<Array<{ count: number; rating: number }>>;
  updateShoe: (token: string, updateParam: any) => Promise<Shoe>;
}
