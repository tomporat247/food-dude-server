import { Router } from 'express';
import { isAdminMiddleWare } from '../middlewares/auth';
import {
  validateCategorySearchQueryParams,
  validateCategoryUpdateBody,
  validateCreateCategoryBody
} from '../middlewares/validators/category-validator';
import {
  createNewCategory,
  getCategories,
  getCategoryAverageRating,
  getCategoryRestaurantShare,
  removeCategory,
  searchCategories,
  updateCategory
} from '../controllers/category';
import { getParameterObjectIdValidator } from '../middlewares/validators/common-validators';

export const categoryRouter = Router();

//@ts-ignore
categoryRouter.get('/', getCategories);
//@ts-ignore
categoryRouter.post('/', isAdminMiddleWare, validateCreateCategoryBody, createNewCategory);
categoryRouter.put(
  '/:id',
  isAdminMiddleWare,
  //@ts-ignore
  getParameterObjectIdValidator('id'),
  validateCategoryUpdateBody,
  updateCategory
);
//@ts-ignore
categoryRouter.delete('/:id', isAdminMiddleWare, getParameterObjectIdValidator('id'), removeCategory);
//@ts-ignore
categoryRouter.get('/search', validateCategorySearchQueryParams, searchCategories);
//@ts-ignore
categoryRouter.get('/statistics/category-restaurant-share', isAdminMiddleWare, getCategoryRestaurantShare);
//@ts-ignore
categoryRouter.get('/statistics/category-average-rating', isAdminMiddleWare, getCategoryAverageRating);
