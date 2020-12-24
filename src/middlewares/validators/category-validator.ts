import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { RequestWithSession } from '../../types/request-with-session';
import { number, object, string } from 'joi';
import { Category, CategorySearchProperties } from '../../models/category';

const categorySchema = object({
  name: string(),
  description: string()
});

const categorySearchSchema = categorySchema.keys({ minRestaurantAmount: number().positive() });

export const validateCreateCategoryBody = (req: RequestWithSession<Category>, res: Response, next: NextFunction) => {
  validateSchema(categorySchema, req.body, 'required');
  next();
};

export const validateCategoryUpdateBody = (
  req: RequestWithSession<Partial<Category>, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(categorySchema, req.body, 'optional');
  next();
};

export const validateCategorySearchQueryParams = (
  req: RequestWithSession<any, any, CategorySearchProperties>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(categorySearchSchema, req.query, 'optional');
  next();
};
