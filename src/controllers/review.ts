import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import {
  createReview,
  findPopulatedReview,
  findReviews,
  removeReviewById,
  updateReviewById
} from '../db/queries/review-queries';
import { doesRestaurantExist, findRestaurantById } from '../db/queries/restaurant-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { doesUserExist } from '../db/queries/user-queries';
import { Review } from '../models/review';
import { Restaurant } from '../models/restaurant';

const validateRestaurantReviewsNotBlocked = (restaurant: Restaurant) => {
  if (restaurant.reviewsBlocked) {
    throw new FoodDudeError('restaurants reviews are blocked', 403);
  }
};

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

    const restaurant = await findRestaurantById(restaurantId);
    if (restaurant === null) {
      next(new FoodDudeError(`restaurant with id "${restaurantId}" does not exist`, 404));
    } else {
      validateRestaurantReviewsNotBlocked(restaurant);
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

// TODO: Let only an admin or the owner to execute this
export const updateReview = async (
  req: RequestWithSession<Partial<Review>, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentReview = await findPopulatedReview(req.params.id);
    validateRestaurantReviewsNotBlocked(currentReview.restaurant as Restaurant);
    const updatedReview = await updateReviewById(req.params.id, req.body);
    if (updatedReview === null) {
      next(new FoodDudeError(`review with id "${req.params.id}" does not exist`, 404));
    } else {
      res.send(updatedReview);
    }
  } catch (e) {
    next(e);
  }
};

// TODO: Let only an admin or the owner to execute this
export const removeReview = async (req: RequestWithSession<any, { id: string }>, res: Response, next: NextFunction) => {
  try {
    const currentReview = await findPopulatedReview(req.params.id);
    validateRestaurantReviewsNotBlocked(currentReview.restaurant as Restaurant);
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
