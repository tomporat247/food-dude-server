import { Router } from 'express';
import {
  createNewRestaurant,
  getFullRestaurant,
  getRestaurants,
  removeRestaurant,
  updateRestaurant
} from '../controllers/restaurant';
import { isAdminMiddleWare } from '../middlewares/auth';
import {
  validateCreateRestaurantBody,
  validateUpdateRestaurantBody
} from '../middlewares/validators/restaurant-validator';
import { getParameterObjectIdValidator } from '../middlewares/validators/common-validators';

export const restaurantRouter = Router();

//@ts-ignore
restaurantRouter.get('/', getRestaurants);
//@ts-ignore
restaurantRouter.get('/:id', getParameterObjectIdValidator('id'), getFullRestaurant);
//@ts-ignore
restaurantRouter.post('/', isAdminMiddleWare, validateCreateRestaurantBody, createNewRestaurant);
//@ts-ignore
restaurantRouter.delete('/:id', isAdminMiddleWare, getParameterObjectIdValidator('id'), removeRestaurant);
restaurantRouter.put(
  '/:id',
  isAdminMiddleWare,
  //@ts-ignore
  getParameterObjectIdValidator('id'),
  validateUpdateRestaurantBody,
  updateRestaurant
);
