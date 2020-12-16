import { NextFunction } from 'express';
import { Schema, string } from 'joi';
import { validateSchema } from './utils/validate-schema';
import { emailSchema, userSchema } from './utils/common-validators';

const userSignInSchema = emailSchema.keys({ password: string().min(6).required() });

const validateAuthBody = (schema: Schema, req: Request, next: NextFunction) => {
  validateSchema(schema, req.body, 'required');
  next();
};

export const validateUserSignInBody = (req: Request, res: Response, next: NextFunction) => {
  validateAuthBody(userSignInSchema, req, next);
};

export const validateUserSignUpBody = (req: Request, res: Response, next: NextFunction) => {
  validateAuthBody(userSchema, req, next);
};