import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { RequestWithSession } from '../../types/request-with-session';
import { emailSchema, userSchema, userSchemaWithRole } from './utils/common-validators';
import { isCurrentUserAdmin } from '../../utils/user-utils';
import { User } from '../../models/user';

export const validateEmailParameter = (
  req: RequestWithSession<any, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(emailSchema, req.params, 'required');
  next();
};

export const validateUserUpdateBody = (
  req: RequestWithSession<Partial<User>, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(isCurrentUserAdmin(req) ? userSchemaWithRole : userSchema, req.body, 'optional');
  next();
};
