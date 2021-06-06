//!
//! Copyright (c) 2019 - SneakGeek. All rights reserved
//!

import { Review } from "../../../infra/database";

export type ReviewStats = {
  rating: number;
  count: number;
};

export interface IReviewDao {
  getReviewsAndPopulateAuthor(shoeId: string): Promise<Review[]>;

  /**
   * @desciption Get review statistics of a shoe by ID
   *
   * @param {string} shoeId
   * @return Review statistics of a shoe
   * @throw Error if database operation fails
   */
  getAvgReview(shoeId: string): Promise<number>;
  getRatingsMap(shoeId: string): Promise<Array<ReviewStats>>;
  createReview(input: Partial<Review>): Promise<Review>;
}
