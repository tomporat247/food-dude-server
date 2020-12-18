import { verify } from 'jsonwebtoken';
import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import { FoodDudeError } from '../models/food-dude-error';
import { isCurrentUserAdmin } from '../utils/user-utils';
import { get } from 'nconf';

const accessTokenSecret = get('auth:secret');

const routePrefixesToIgnore = ['/api-docs', '/auth'];

export const authMiddleWare = (req: RequestWithSession, res: Response, next: NextFunction) => {
  req.session.user = null;
  if (routePrefixesToIgnore.findIndex(routePrefix => req.url.startsWith(routePrefix)) === -1) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      verify(token, accessTokenSecret, async (err, user) => {
        if (err) {
          next(new FoodDudeError('auth error', 403));
        } else {
          req.session.user = user;
          next();
        }
      });
    } else {
      next(new FoodDudeError('auth error - no "authorization" header in request', 401));
    }
  } else {
    next();
  }
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
  req: RequestWithSession<any, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  if (req.params.id !== req.session.user?._id && !isCurrentUserAdmin(req)) {
    next(
      new FoodDudeError(
        `permission error - user role must be admin or given email should match current user's email"`,
        401
      )
    );
  }
  next();
};
