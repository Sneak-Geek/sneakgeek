import { Shoe, Review, SellOrder, BuyOrder } from "../../model";
import { BaseService } from "./BaseService";
import { IShoeService } from "../interfaces/IShoeService";

export class ShoeService extends BaseService implements IShoeService {
  public async searchShoes(
    key: string,
    page: number = 0,
    gender?: string,
    brand?: string[]
  ): Promise<{ count: number; shoes: Shoe[] }> {
    let queryUrl = `/shoe/find?page=${page}`;
    if (key.length > 0) {
      queryUrl += `&title=${key}`;
    }

    if (gender && gender.length > 0) {
      queryUrl += `&gender=${gender}`;
    }

    if (brand && brand.length > 0) {
      queryUrl += `&brand=${brand.join(",")}`;
    }

    const response = await this.apiClient.getInstance().get(queryUrl);
    return response.data;
  }

  public async getShoeReviews(shoeId: string): Promise<Review[]> {
    const response = await this.apiClient.getInstance().get(`/review?shoeId=${shoeId}`);

    return response.data.reviews as Review[];
  }

  public async addReview(token: string, review: Review): Promise<void> {
    return this.apiClient.getInstance().post(
      `/review/`,
      {
        shoeId: review.shoeId,
        rating: review.rating,
        description: review.description,
        imageUrls: review.imageUrls,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );
  }

  public async getShoeInfo(
    shoeId: string
  ): Promise<{
    relatedShoes: Shoe[];
    lowestSellOrder?: SellOrder;
    highestBuyOrder?: BuyOrder;
  }> {
    const response = await this.apiClient
      .getInstance()
      .get(`/shoe/detail?shoeId=${shoeId}`);
    return response.data;
  }

  public async getReviewStats(
    shoeId: string
  ): Promise<Array<{ count: number; rating: number }>> {
    const response = await this.apiClient
      .getInstance()
      .get(`/review/stats?shoeId=${shoeId}`);

    return response.data || [];
  }

  public async updateShoe(token: string, updateParam: any) {
    const response = await this.apiClient
      .getInstance()
      .put(
        '/shoe/update',
        { ...updateParam },
        { headers: { authorization: token } }
      );
    return response.data;
  }
}
