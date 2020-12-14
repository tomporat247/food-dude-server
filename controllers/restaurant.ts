import { NextFunction, Response } from 'express';
import { CreateRestaurantBody } from '../models/restaurant';
import { createRestaurant, findAllRestaurants } from '../db/queries/restaurant-queries';
import { RequestWithSession } from '../types/request-with-session';
import { findCategoryById } from '../db/queries/categroy-queries';
import { FoodDudeError } from '../models/food-dude-error';

export const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurants = await findAllRestaurants({ populateCategory: true }).select(['-reviews']);
    res.send(restaurants);
  } catch (e) {
    next(e);
  }
};

export const getFullRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurants = await findAllRestaurants({ populateCategory: true, populateReviews: true });
    res.send(restaurants);
  } catch (e) {
    next(e);
  }
};

export const createNewRestaurant = async (
  req: RequestWithSession<CreateRestaurantBody>,
  res: Response,
  next: NextFunction
) => {
  const category = await findCategoryById(req.body.category as string);
  if (category === null) {
    next(new FoodDudeError('invalid category', 400));
  } else {
    try {
      const restaurantToCreate = { ...req.body, reviews: [] };
      const createdRestaurant = await createRestaurant(restaurantToCreate);
      res.send(createdRestaurant);
    } catch (e) {
      next(e);
    }
  }
};
