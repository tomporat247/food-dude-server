import { Router } from 'express';
import {
  createNewRestaurant,
  getFullRestaurants,
  getRestaurants,
  removeRestaurant,
  updateRestaurant
} from '../controllers/restaurant';
import { isAdminMiddleWare } from '../middlewares/authentication';
import {
  validateCreateRestaurantBody,
  validateUpdateRestaurantBody
} from '../middlewares/validators/restaurant-validator';
import { validateObjectIdParameter } from '../middlewares/validators/common-validators';

export const restaurantRouter = Router();

//@ts-ignore
restaurantRouter.get('/', getRestaurants);
//@ts-ignore
restaurantRouter.get('/full', getFullRestaurants);
//@ts-ignore
restaurantRouter.post('/', isAdminMiddleWare, validateCreateRestaurantBody, createNewRestaurant);
//@ts-ignore
restaurantRouter.delete('/:id', isAdminMiddleWare, validateObjectIdParameter, removeRestaurant);
restaurantRouter.put(
  '/:id',
  isAdminMiddleWare,
  //@ts-ignore
  validateObjectIdParameter,
  validateUpdateRestaurantBody,
  updateRestaurant
);
