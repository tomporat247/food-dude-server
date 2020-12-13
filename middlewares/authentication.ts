import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import { FoodDudeError } from '../models/food-dude-error';

const routesToIgnore = new Set(['/authentication/sign-in', '/authentication/sign-up']);

const isCurrentUserAdmin = (req: RequestWithSession) => req.session.user?.role === 'admin';

export const authenticationMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  if (!routesToIgnore.has(req.url) && !req.session.user) {
    next(new FoodDudeError('unauthenticated user - access blocked', 401));
  }
  next();
};

export const isAdminMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  if (!isCurrentUserAdmin(req)) {
    next(
      new FoodDudeError(`permission error - user role must be admin, current role: "${req.session?.user?.role}"`, 401)
    );
  }
  next();
};

export const isAdminOrCurrentUserMiddleware = (
  req: RequestWithSession<any, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  if (req.params.email !== req.session.user?.email && !isCurrentUserAdmin(req)) {
    next(
      new FoodDudeError(
        `permission error - user role must be admin or given email should match current user's email"`,
        401
      )
    );
  }
  next();
};
