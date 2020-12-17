import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import {
  createCategory,
  findAllCategories,
  findCategoryByName,
  removeCategoryById,
  updateCategoryById
} from '../db/queries/categroy-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { Category } from '../models/category';
import { findRestaurantsByCategory } from '../db/queries/restaurant-queries';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await findAllCategories();
    res.send(categories);
  } catch (e) {
    next(e);
  }
};

export const createNewCategory = async (req: RequestWithSession<Category, any>, res: Response, next: NextFunction) => {
  try {
    const categoryWithMatchingName = await findCategoryByName(req.body.name);
    if (categoryWithMatchingName) {
      next(new FoodDudeError(`category with name ${req.body.name} already exists`, 403));
    } else {
      const newCategory = await createCategory(req.body);
      res.send(newCategory);
    }
  } catch (e) {
    next(e);
  }
};

export const updateCategory = async (
  req: RequestWithSession<Category, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    let categoryWithMatchingName;
    if (req.body.name) {
      categoryWithMatchingName = await findCategoryByName(req.body.name);
    }
    if (categoryWithMatchingName) {
      next(new FoodDudeError(`category with name "${req.body.name}" already exists`, 403));
    } else {
      const updatedCategory = await updateCategoryById(req.params.id, req.body);
      if (updatedCategory === null) {
        next(new FoodDudeError(`could not find category with id: "${req.params.id}"`, 404));
      } else {
        res.send(updatedCategory);
      }
    }
  } catch (e) {
    next(e);
  }
};

export const removeCategory = async (
  req: RequestWithSession<any, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryId = req.params.id;

    const categoryRestaurants = await findRestaurantsByCategory(categoryId);
    if (categoryRestaurants.length > 0) {
      next(new FoodDudeError('cannot delete category with listed restaurants', 403));
    }

    const deletedCategory = await removeCategoryById(categoryId);

    if (deletedCategory === null) {
      next(new FoodDudeError(`could not find category with id: "${categoryId}"`, 404));
    } else {
      res.send(deletedCategory);
    }
  } catch (e) {
    next(e);
  }
};
