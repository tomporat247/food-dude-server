import { Schema } from 'joi';
import { FoodDudeError } from '../../../models/food-dude-error';

export const validateSchema = <T>(schema: Schema, toValidate: T): T => {
  const { value, error } = schema.validate(toValidate);
  if (error) {
    throw new FoodDudeError(`validation error: ${JSON.stringify(error)}`, 400, error);
  }
  return value;
};
