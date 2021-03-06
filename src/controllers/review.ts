import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import {
  createReview,
  findPopulatedReview,
  findReviews,
  removeReviewById,
  updateReviewById
} from '../db/queries/review-queries';
import { findRestaurantById } from '../db/queries/restaurant-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { Review } from '../models/review';
import { Restaurant } from '../models/restaurant';
import { User } from '../models/user';

const validateRestaurantReviewsNotBlocked = (restaurant: Restaurant) => {
  if (restaurant.reviewsBlocked) {
    throw new FoodDudeError('restaurants reviews are blocked', 403);
  }
};

const validateCurrentUserOrAdmin = (user: User, review: Review) => {
  if (user.role !== 'admin' && (review.user as User)._id.toString() !== user._id.toString()) {
    throw new FoodDudeError('only an admin or the user that created the review are allowed to do this action', 403);
  }
};

export const getReviews = async (
  req: RequestWithSession<any, any, { restaurantName: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantName = req.query.restaurantName;
    const reviews = await findReviews({ restaurantName });
    res.send(reviews);
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

export const updateReview = async (
  req: RequestWithSession<Partial<Review>, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentReview = await findPopulatedReview(req.params.id);
    validateCurrentUserOrAdmin(req.session.user, currentReview);
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

export const removeReview = async (req: RequestWithSession<any, { id: string }>, res: Response, next: NextFunction) => {
  try {
    const currentReview = await findPopulatedReview(req.params.id);
    validateCurrentUserOrAdmin(req.session.user, currentReview);
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
