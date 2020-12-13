import * as objectHash from 'object-hash';
import { NextFunction, Response } from 'express';
import { RequestWithSession } from '../types/request-with-session';
import { omit } from 'lodash';
import { SignInUserArguments, SignUpUserArguments, UserDocument } from '../models/user';
import { createUser, findUserByEmailAndPassword } from '../db/queries/user-queries';
import { FoodDudeError } from '../models/food-dude-error';

const getUserWithoutPrivateData = (user: UserDocument) => omit(user.toObject(), ['passwordHash', '_id']);

export const signUp = async (req: RequestWithSession<SignUpUserArguments>, res: Response, next: NextFunction) => {
  const { password, ...userData } = req.body;
  const user = {
    ...userData,
    passwordHash: objectHash(password)
  };

  try {
    req.session.user = await createUser(user);
    res.send(getUserWithoutPrivateData(req.session.user));
  } catch (e) {
    next(e.code === 11000 ? new FoodDudeError(`"${req.body.email}" email is taken by another user`, e) : e);
  }
};

export const signIn = async (req: RequestWithSession<SignInUserArguments>, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    req.session.user = await findUserByEmailAndPassword(email, objectHash(password));
    if (req.session.user === null) {
      next(new FoodDudeError('no match for user with given credentials', 'no match for user with given credentials'));
    } else {
      res.send(getUserWithoutPrivateData(req.session.user));
    }
  } catch (e) {
    next(e);
  }
};

export const signOut = (req: RequestWithSession, res: Response) => {
  delete req.session.user;
  res.sendStatus(200);
};
