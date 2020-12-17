import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import { findReviews } from '../db/queries/review-queries';
import { doesRestaurantExist } from '../db/queries/restaurant-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { doesUserExist } from '../db/queries/user-queries';

export const getReviews = async (
  req: RequestWithSession<any, any, { restaurantId: string; userId: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = req.query.restaurantId;
    const userId = req.query.userId;

    const restaurantExists = !restaurantId || await doesRestaurantExist(restaurantId);
    const userExists = !userId || await doesUserExist(userId);

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
