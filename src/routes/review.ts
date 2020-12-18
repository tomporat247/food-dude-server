import { Router } from 'express';
import { addReview, getReviews } from '../controllers/review';
import {
  getParameterObjectIdValidator,
  getQueryPropertiesObjectIdValidator
} from '../middlewares/validators/common-validators';

export const reviewRouter = Router();

//@ts-ignore
reviewRouter.get('/', getQueryPropertiesObjectIdValidator({ optional: ['restaurantId', 'userId'] }), getReviews);
//@ts-ignore
reviewRouter.post('/:restaurantId', getParameterObjectIdValidator('restaurantId'), addReview);
