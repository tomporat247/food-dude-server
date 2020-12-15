import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { RequestWithSession } from '../../types/request-with-session';
import { number, string } from 'joi';
import { addressSchema, mongoObjectIdValidator } from './utils/common-validators';
import {CreateRestaurantBody, UpdateRestaurantBody} from '../../models/restaurant';

const restaurantSchema = addressSchema.keys({
  name: string(),
  description: string(),
  rating: number(),
  imageUrl: string().uri(),
  category: mongoObjectIdValidator
});

export const validateCreateRestaurantBody = (
  req: RequestWithSession<CreateRestaurantBody>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(restaurantSchema, req.body, 'required');
  next();
};

export const validateUpdateRestaurantBody = (
    req: RequestWithSession<UpdateRestaurantBody>,
    res: Response,
    next: NextFunction
) => {
  validateSchema(restaurantSchema, req.body, 'optional');
  next();
};
