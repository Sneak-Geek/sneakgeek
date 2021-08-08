// !
// ! Copyright (c) 2019 - SneakGeek. All rights reserved
// !

import { Request, Response } from "express";
import * as HttpStatus from "http-status";
import {
  controller,
  httpPost,
  httpGet,
  request,
  response,
  queryParam,
} from "inversify-express-utils";
import { Types } from "../../configuration/inversify/inversify.types";
import { inject } from "inversify";
import { FirebaseAuthMiddleware, ValidationPassedMiddleware } from "../middlewares";
import { body, query } from "express-validator";
import { ProductRating } from "../../assets/constants";
import mongoose from "mongoose";
import { ReviewDao } from "../dao/";

@controller("/api/v1/review")
export class ReviewController {
  @inject(Types.ReviewDao)
  private readonly reviewDao!: ReviewDao;

  @httpGet("/", query("shoeId").isMongoId(), ValidationPassedMiddleware)
  public async getShoeReviews(
    @queryParam("shoeId") shoeId: string,
    @response() res: Response
  ) {
    try {
      const reviews = await this.reviewDao.getReviewsAndPopulateAuthor(shoeId);
      return res.status(HttpStatus.OK).send({ reviews });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpPost(
    "/",
    FirebaseAuthMiddleware,
    body("shoeId").isMongoId(),
    body("rating").isIn(ProductRating),
    body("description").isString(),
    body("imageUrls").optional().isArray(),
    body("imageUrls[*]").optional().isURL(),
    ValidationPassedMiddleware
  )
  public async createReview(@request() req: Request, @response() res: Response) {
    try {
      const { shoeId, rating, description, imageUrls } = req.body;
      const userId = req.user._id;

      await this.reviewDao.createReview({
        reviewedBy: userId,
        shoeId: mongoose.Types.ObjectId(shoeId),
        rating: rating,
        description: description,
        imageUrls: imageUrls ?? [],
      });

      return res.status(HttpStatus.CREATED).send({
        message: "Create review successfully!",
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }

  @httpGet("/stats", query("shoeId").isMongoId(), ValidationPassedMiddleware)
  public async getReviewStats(
    @queryParam("shoeId") shoeId: string,
    @response() res: Response
  ) {
    try {
      const avg = await this.reviewDao.getAvgReview(shoeId);
      const ratingCounts = await this.reviewDao.getRatingsMap(shoeId);

      return res.status(HttpStatus.OK).send({
        avg,
        ratingCounts,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: "Unexpected error!",
      });
    }
  }
}
