import { IReviewDao, ReviewStats } from "./IReviewDao";
import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { Types } from "../../../configuration/inversify";
import { Repository, Review } from "../../database";

@injectable()
export class ReviewDao implements IReviewDao {
  @inject(Types.ReviewRepository)
  private readonly reviewRepo!: Repository<Review>;

  public async getAvgReview(shoeId: string): Promise<number> {
    const average = await this.reviewRepo
      .aggregate([
        {
          $match: {
            shoeId: new ObjectId(shoeId),
          },
        },
        {
          $group: {
            _id: null,
            totalRating: {
              $sum: "$rating",
            },
            numberOfReviews: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            avg: {
              $divide: ["$totalRating", "$numberOfReviews"],
            },
            _id: 0,
          },
        },
      ])
      .exec();
    return average[0].avg ?? 0;
  }

  public async getRatingsMap(shoeId: string): Promise<ReviewStats[]> {
    const statsMap = await this.reviewRepo
      .aggregate([
        {
          $match: {
            shoeId: new ObjectId(shoeId),
          },
        },
        {
          $group: {
            _id: "$rating",
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            count: 1,
            rating: "$_id",
          },
        },
      ])
      .exec();

    return statsMap;
  }

  public async getReviewsAndPopulateAuthor(shoeId: string): Promise<Review[]> {
    return await this.reviewRepo
      .find({ shoeId: new ObjectId(shoeId) })
      .populate({
        path: "reviewedBy",
        select: "profile accountProfilePicByProvider",
        populate: {
          path: "profile",
          select: "userProvidedName userProvidedProfilePic",
        },
      })
      .exec();
  }

  public async createReview(review: Partial<Review>): Promise<Review> {
    return await this.reviewRepo.create({
      reviewedBy: review.reviewedBy,
      shoeId: review.shoeId,
      rating: review.rating,
      description: review.description,
      imageUrls: review.imageUrls,
    });
  }
}
