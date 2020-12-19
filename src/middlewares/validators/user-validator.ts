import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { RequestWithSession } from '../../types/request-with-session';
import { userSchema, userSchemaWithRole, userSearchSchema } from './utils/common-validators';
import { isCurrentUserAdmin } from '../../utils/user-utils';
import { User, UserSearchProperties } from '../../models/user';
import { isNil, omitBy } from 'lodash';
import { Address } from '../../types/address';

export const validateUserUpdateBody = (
  req: RequestWithSession<Partial<User>, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(isCurrentUserAdmin(req) ? userSchemaWithRole : userSchema, req.body, 'optional');
  next();
};

export const validateUserSearchQueryParameters = (
  req: RequestWithSession<any, any, UserSearchProperties>,
  res: Response,
  next: NextFunction
) => {
  const { area, city, street, houseNumber, ...propertiesWithoutAddress } = req.query;
  validateSchema(
    userSearchSchema,
    { ...propertiesWithoutAddress, address: omitBy({ area, city, street, houseNumber } as Address, isNil) },
    'optional'
  );
  next();
};
