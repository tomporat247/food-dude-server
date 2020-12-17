import { Router } from 'express';
import { getReviews } from '../controllers/review';
import { getQueryPropertiesObjectIdValidator } from '../middlewares/validators/common-validators';

export const reviewRouter = Router();

//@ts-ignore
reviewRouter.get('/', getQueryPropertiesObjectIdValidator({ optional: ['restaurantId', 'userId'] }), getReviews);
