import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import {
  createCategory,
  findAllCategories,
  findCategoriesByIds,
  findCategoriesForSearch,
  findCategoryByName,
  getCategoryToRestaurantAmount,
  removeCategoryById,
  updateCategoryById
} from '../db/queries/categroy-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { Category, CategorySearchProperties } from '../models/category';
import { findRestaurantsByCategory, getCategoryToAverageRestaurantRating } from '../db/queries/restaurant-queries';

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

export const searchCategories = async (
  req: RequestWithSession<any, any, CategorySearchProperties>,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchResults = await findCategoriesForSearch(req.query);
    res.send(searchResults);
  } catch (e) {
    next(e);
  }
};

const getStatisticAnalysisFromCategoryToRestaurantAmount = (
  categoryToRestaurantAmount: Record<string, { name: string; restaurantAmount: number }>
): Array<{ id: string; name: string; percentage: number; amount: number }> => {
  const totalRestaurants = Object.values(categoryToRestaurantAmount).reduce(
    (acc, curr) => acc + curr.restaurantAmount,
    0
  );

  const idToPercentageAndAmount = Object.entries(categoryToRestaurantAmount).reduce(
    (acc, [id, { name, restaurantAmount }]) => {
      acc[id] = { name, amount: restaurantAmount, percentage: restaurantAmount / totalRestaurants };
      return acc;
    },
    {} as Record<string, { percentage: number; amount: number; name: string }>
  );

  return Object.entries(idToPercentageAndAmount).reduce((acc, [id, value]) => {
    acc.push({ ...value, id });
    return acc;
  }, [] as Array<{ id: string; name: string; percentage: number; amount: number }>);
};

export const getCategoryRestaurantShare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryToRestaurantAmount = await getCategoryToRestaurantAmount();
    const categoryIdsAndNames = await findCategoriesByIds(Object.keys(categoryToRestaurantAmount)).select([
      '_id',
      'name'
    ]);

    const categoryToName = categoryIdsAndNames.reduce((acc, category) => {
      acc[category._id.toString()] = category.name;
      return acc;
    }, {} as Record<string, string>);

    const categoryToRestaurantAmountAndName: Record<string, { name: string; restaurantAmount: number }> = Object.keys(
      categoryToName
    ).reduce((acc, categoryId) => {
      acc[categoryId] = { name: categoryToName[categoryId], restaurantAmount: categoryToRestaurantAmount[categoryId] };
      return acc;
    }, {} as Record<string, { name: string; restaurantAmount: number }>);
    res.send(getStatisticAnalysisFromCategoryToRestaurantAmount(categoryToRestaurantAmountAndName));
  } catch (e) {
    next(e);
  }
};

export const getCategoryAverageRating = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryToAverageRating = await getCategoryToAverageRestaurantRating();
    const categoryIdsAndNames = await findCategoriesByIds(Object.keys(categoryToAverageRating)).select(['_id', 'name']);

    const categoryToName = categoryIdsAndNames.reduce((acc, category) => {
      acc[category._id.toString()] = category.name;
      return acc;
    }, {} as Record<string, string>);
    const categoryWithAverageRatingAndName: Array<{ id: string; name: string; averageRating: number }> = Object.keys(
      categoryToAverageRating
    ).reduce((acc, categoryId) => {
      acc.push({
        id: categoryId,
        name: categoryToName[categoryId],
        averageRating: categoryToAverageRating[categoryId]
      });
      return acc;
    }, [] as Array<{ id: string; name: string; averageRating: number }>);
    res.send(categoryWithAverageRatingAndName);
  } catch (e) {
    next(e);
  }
};
