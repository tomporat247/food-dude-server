import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { RequestWithSession } from '../../types/request-with-session';
import { Review } from '../../models/review';
import { object, string } from 'joi';

const reviewSchema = object({
  content: string()
});

export const validateCreateReviewBody = (
  req: RequestWithSession<Partial<Review>>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(reviewSchema, req.body, 'required');
  next();
};

export const validateUpdateReviewBody = validateCreateReviewBody;
