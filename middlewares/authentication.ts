import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import { FoodDudeError } from '../models/food-dude-error';

const routesToIgnore = new Set(['/authentication/sign-in', '/authentication/sign-up']);

export const authenticationMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  if (!routesToIgnore.has(req.url) && !req.session.user) {
    next(new FoodDudeError('unauthenticated user - access blocked', 401));
  }
  next();
};

export const isAdminMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  const role = req.session?.user?.role;
  if (role !== 'admin') {
    next(new FoodDudeError(`permission error - user role must be admin, current role: "${role}"`, 401));
  }
  next();
};
