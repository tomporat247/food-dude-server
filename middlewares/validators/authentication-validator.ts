import { NextFunction } from 'express';
import { number, object, Schema, string } from 'joi';
import { validateSchema } from './utils/validate-schema';

const userSignInSchema = object({ email: string().email().required(), password: string().min(6).required() });
const userSignUpSchema = userSignInSchema.keys({
  firstName: string().required(),
  lastName: string().required(),
  address: object({
    city: string().required(),
    street: string().required(),
    houseNumber: number().positive().required()
  }).required()
});

const validateAuthenticationParameters = (schema: Schema, req: Request, next: NextFunction) => {
  validateSchema(schema, req.body);
  next();
};

export const validateUserSignIn = (req: Request, res: Response, next: NextFunction) => {
  validateAuthenticationParameters(userSignInSchema, req, next);
};

export const validateUserSignUp = (req: Request, res: Response, next: NextFunction) => {
  validateAuthenticationParameters(userSignUpSchema, req, next);
};
