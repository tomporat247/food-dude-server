import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import {
  createCategory,
  findAllCategories,
  removeCategoryByName,
  updateCategoryByName
} from '../db/queries/categroy-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { Category } from '../models/category';

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
    const newCategory = await createCategory(req.body);
    res.send(newCategory);
  } catch (e) {
    next(e);
  }
};

export const updateCategory = async (
  req: RequestWithSession<Category, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedCategory = await updateCategoryByName(req.params.name, req.body);
    if (updatedCategory === null) {
      next(new FoodDudeError(`could not find category with name: "${req.params.name}"`, 400));
    } else {
      res.send(updatedCategory);
    }
  } catch (e) {
    next(e);
  }
};

export const removeCategory = async (
  req: RequestWithSession<any, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedCategory = await removeCategoryByName(req.params.name);

    if (deletedCategory === null) {
      next(new FoodDudeError(`could not find category with name: "${req.params.name}"`, 400));
    } else {
      res.send(deletedCategory);
    }
  } catch (e) {
    next(e);
  }
};
