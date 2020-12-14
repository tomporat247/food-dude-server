import { Router } from 'express';
import { getFullRestaurants, getRestaurants, createNewRestaurant } from '../controllers/restaurant';
import { isAdminMiddleWare } from '../middlewares/authentication';
import { validateCreateRestaurantBody } from '../middlewares/validators/restaurant-validator';

export const restaurantRouter = Router();

//@ts-ignore
restaurantRouter.get('/', getRestaurants);
//@ts-ignore
restaurantRouter.get('/full', getFullRestaurants);
//@ts-ignore
restaurantRouter.post('/', isAdminMiddleWare, validateCreateRestaurantBody, createNewRestaurant);
