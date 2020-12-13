import * as objectHash from 'object-hash';
import { NextFunction, Response } from 'express';
import { RequestWithSession } from '../types/request-with-session';
import { SignInUserArguments, SignUpUserArguments, User } from '../models/user';
import { createUser, findUserByEmailAndPassword } from '../db/queries/user-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { getUserWithoutPrivateData } from '../utils/user-utils';

export const signUp = async (req: RequestWithSession<SignUpUserArguments>, res: Response, next: NextFunction) => {
  const { password, ...userData } = req.body;
  const user: User = { ...userData, role: 'viewer', passwordHash: objectHash(password) };

  try {
    req.session.user = await createUser(user);
    res.send(getUserWithoutPrivateData(req.session.user));
  } catch (e) {
    next(e.code === 11000 ? new FoodDudeError(`"${req.body.email}" email is taken by another user`, 403) : e);
  }
};

export const signIn = async (req: RequestWithSession<SignInUserArguments>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    req.session.user = await findUserByEmailAndPassword(email, objectHash(password));
    if (req.session.user === null) {
      next(new FoodDudeError('no match for user with given credentials', 404));
    } else {
      res.send(getUserWithoutPrivateData(req.session.user));
    }
  } catch (e) {
    next(e);
  }
};

export const signOut = (req: RequestWithSession, res: Response) => {
  req.session.user = null;
  res.sendStatus(200);
};
