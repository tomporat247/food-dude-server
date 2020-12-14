import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { RequestWithSession } from '../../types/request-with-session';
import { object, string } from 'joi';
import { Category } from '../../models/category';

const categorySchema = object({
  name: string().optional(),
  description: string().optional()
});

export const validateCategoryUpdateBody = (
  req: RequestWithSession<Partial<Category>, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(categorySchema, req.body, 'optional');
  next();
};

export const validateCreateCategoryBody = (
  req: RequestWithSession<Partial<Category>, { name: string }>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(categorySchema, req.body, 'required');
  next();
};
