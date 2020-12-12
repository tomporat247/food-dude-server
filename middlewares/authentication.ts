import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';

const routesToIgnore = new Set(['/authentication/sign-in', '/authentication/sign-up']);

export const authenticationMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  if (!routesToIgnore.has(req.url) && !req.session.user) {
    res.status(401).send('Unauthenticated user - access blocked');
  }
  next();
};
