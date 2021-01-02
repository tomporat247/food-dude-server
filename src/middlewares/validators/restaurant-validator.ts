import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { RequestWithSession } from '../../types/request-with-session';
import { number, object, string } from 'joi';
import { addressSchema, mongoObjectIdValidator, partialAddressSchema } from './utils/common-validators';
import { CreateRestaurantBody, RestaurantSearchProperties, UpdateRestaurantBody } from '../../models/restaurant';
import { isNil, omitBy } from 'lodash';
import { Address } from '../../types/address';

const ratingValidator = number().integer().min(1).max(5);

const basicRestaurantSchema = object({
  name: string(),
  description: string()
});

const restaurantSchema = basicRestaurantSchema.concat(addressSchema).keys({
  rating: ratingValidator,
  imageUrl: string().uri(),
  category: mongoObjectIdValidator
});
const restaurantSearchSchema = basicRestaurantSchema.concat(partialAddressSchema).keys({
  minRating: ratingValidator,
  category: string()
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

export const validateRestaurantSearchQueryParameters = (
  req: RequestWithSession<any, any, RestaurantSearchProperties>,
  res: Response,
  next: NextFunction
) => {
  const { area, city, street, houseNumber, ...propertiesWithoutAddress } = req.query;
  req.query = validateSchema(
    restaurantSearchSchema,
    { ...propertiesWithoutAddress, address: omitBy({ area, city, street, houseNumber } as Address, isNil) },
    'optional'
  );
  next();
};
