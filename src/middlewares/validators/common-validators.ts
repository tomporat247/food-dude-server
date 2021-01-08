import { RequestWithSession } from '../../types/request-with-session';
import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { mongoObjectIdValidator } from './utils/common-validators';
import { object } from 'joi';

const objectIdSchema = object({ id: mongoObjectIdValidator });

export const validateObjectId = (id: string) => validateSchema(objectIdSchema, { id }, 'required');

const validateObjectIds = (ids: string[]) => ids.forEach(id => validateObjectId(id));

export const getParameterObjectIdValidator = (properties: string[] | string) => (
  req: RequestWithSession,
  res: Response,
  next: NextFunction
) => {
  validateObjectIds((Array.isArray(properties) ? properties : [properties]).map(property => req.params[property]));
  next();
};

export const getQueryPropertiesObjectIdValidator = ({
  required,
  optional
}: {
  required: string[];
  optional: string[];
}) => (req: RequestWithSession, res: Response, next: NextFunction) => {
  validateObjectIds(
    (required || [])
      .concat((optional || []).filter(property => property in req.query))
      .map(property => req.query[property])
  );
  next();
};
