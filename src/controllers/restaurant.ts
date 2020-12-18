import { NextFunction, Response } from 'express';
import { CreateRestaurantBody, UpdateRestaurantBody } from '../models/restaurant';
import {
  createRestaurant,
  findAllRestaurants,
  findRestaurantById,
  removeRestaurantById,
  updateRestaurantById
} from '../db/queries/restaurant-queries';
import { RequestWithSession } from '../types/request-with-session';
import { FoodDudeError } from '../models/food-dude-error';
import { findCategoryById } from '../db/queries/categroy-queries';

export const getRestaurants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const restaurants = await findAllRestaurants({ populateCategory: true }).select(['-reviews']);
    res.send(restaurants);
  } catch (e) {
    next(e);
  }
};

export const getFullRestaurant = async (
  req: RequestWithSession<any, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurant = await findRestaurantById(req.params.id);
    if (restaurant === null) {
      next(new FoodDudeError(`cannot find restaurant with id: "${req.params.id}"`, 404));
    } else {
      res.send(restaurant);
    }
  } catch (e) {
    next(e);
  }
};

export const createNewRestaurant = async (
  req: RequestWithSession<CreateRestaurantBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await findCategoryById(req.body.category as string);
    if (category === null) {
      next(new FoodDudeError('invalid category', 400));
    } else {
      const restaurantToCreate = { ...req.body, reviews: [] };
      const createdRestaurant = await createRestaurant(restaurantToCreate);
      res.send(createdRestaurant);
    }
  } catch (e) {
    next(e);
  }
};

export const updateRestaurant = async (
  req: RequestWithSession<UpdateRestaurantBody, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedRestaurant = await updateRestaurantById(req.params.id, req.body);
    if (updatedRestaurant === null) {
      next(new FoodDudeError(`could not find restaurant with id: ${req.params.id}`, 404));
    } else {
      res.send(updatedRestaurant);
    }
  } catch (e) {
    next(e);
  }
};

export const removeRestaurant = async (
  req: RequestWithSession<any, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const removedRestaurant = await removeRestaurantById(req.params.id);
    if (removedRestaurant === null) {
      next(new FoodDudeError(`could not find restaurant with id: ${req.params.id}`, 404));
    } else {
      res.send(removedRestaurant);
    }
  } catch (e) {
    next(e);
  }
};
