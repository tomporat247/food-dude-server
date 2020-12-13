import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';

const routesToIgnore = new Set(['/authentication/sign-in', '/authentication/sign-up']);

export const authenticationMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  if (!routesToIgnore.has(req.url) && !req.session.user) {
    res.status(401).send('Unauthenticated user - access blocked');
  }
  next();
};

export const isAdminMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  if (req.session?.user?.role !== 'admin') {
    res.status(401).send('permission error - user role must be admin');
  }
  next();
};
