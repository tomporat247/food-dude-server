import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import { createReview, findReviews, removeReviewById } from '../db/queries/review-queries';
import { doesRestaurantExist } from '../db/queries/restaurant-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { doesUserExist } from '../db/queries/user-queries';
import { Review } from '../models/review';

export const getReviews = async (
  req: RequestWithSession<any, any, { restaurantId: string; userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = req.query.restaurantId;
    const userId = req.query.userId;

    const restaurantExists = !restaurantId || (await doesRestaurantExist(restaurantId));
    const userExists = !userId || (await doesUserExist(userId));

    if (!restaurantExists) {
      next(new FoodDudeError(`restaurant with id "${restaurantId}" does not exist`, 404));
    } else if (!userExists) {
      next(new FoodDudeError(`user with id "${restaurantId}" does not exist`, 404));
    } else {
      const reviews = await findReviews({ restaurantId, userId });
      res.send(reviews);
    }
  } catch (e) {
    next(e);
  }
};

export const addReview = async (
  req: RequestWithSession<Partial<Review>, { restaurantId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = req.params.restaurantId;
    const userId = req.session.user._id;

    const restaurantExists = await doesRestaurantExist(restaurantId);
    if (!restaurantExists) {
      next(new FoodDudeError(`restaurant with id "${restaurantId}" does not exist`, 404));
    } else {
      const reviewData = {
        ...req.body,
        restaurant: restaurantId,
        user: userId
      } as Review;
      const createdReview = await createReview(reviewData);
      res.send(createdReview);
    }
  } catch (e) {
    next(e);
  }
};

export const removeReview = async (req: RequestWithSession<any, { id: string }>, res: Response, next: NextFunction) => {
  try {
    const removedReview = await removeReviewById(req.params.id);
    if (removedReview === null) {
      next(new FoodDudeError(`review with id "${req.params.id}" does not exist`, 404));
    } else {
      res.send(removedReview);
    }
  } catch (e) {
    next(e);
  }
};
