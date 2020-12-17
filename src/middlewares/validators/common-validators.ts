import { RequestWithSession } from '../../types/request-with-session';
import { NextFunction } from 'express';
import { validateSchema } from './utils/validate-schema';
import { mongoObjectIdValidator } from './utils/common-validators';
import { object } from 'joi';

const objectIdSchema = object({ id: mongoObjectIdValidator });

export const validateObjectIdParameter = (
  req: RequestWithSession<any, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  validateSchema(objectIdSchema, { id: req.params.id }, 'required');
  next();
};

export const getQueryPropertiesObjectIdValidator = ({
  required,
  optional
}: {
  required: string[];
  optional: string[];
}) => (req: RequestWithSession, res: Response, next: NextFunction) => {
  (required || [])
    .concat((optional || []).filter(property => property in req.query))
    .forEach(property => validateSchema(objectIdSchema, { id: req.query[property] }, 'required'));
  next();
};
