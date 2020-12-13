import * as objectHash from 'object-hash';
import { NextFunction, Response } from 'express';
import { RequestWithSession } from '../types/request-with-session';
import { omit } from 'lodash';
import { SignInUserArguments, SignUpUserArguments, User } from '../models/user';
import { createUser } from '../db/queries/user-queries';
import { FoodDudeError } from '../models/food-dude-error';

const getUserWithoutPrivateData = (user: User) => omit(user, ['passwordHash'] as Array<keyof User>);

export const signUp = async (req: RequestWithSession<SignUpUserArguments>, res: Response, next: NextFunction) => {
  const { password, ...userData } = req.body;
  req.session.user = {
    ...userData,
    passwordHash: objectHash(password)
  };

  try {
    await createUser(req.session.user);
    res.send(getUserWithoutPrivateData(req.session.user));
  } catch (e) {
    next(e.code === 11000 ? new FoodDudeError(`"${req.body.email}" email is taken by another user`, e) : e);
  }
};

export const signIn = (req: RequestWithSession<SignInUserArguments>, res: Response) => {
  const { email, password } = req.body;
  // TODO: Get user from mongo
  req.session.user = {
    email,
    passwordHash: objectHash(password),
    firstName: '',
    lastName: '',
    address: { city: '', houseNumber: 0, street: '' }
  };
  res.status(200).send(getUserWithoutPrivateData(req.session.user));
};

export const signOut = (req: RequestWithSession, res: Response) => {
  delete req.session.user;
  res.sendStatus(200);
};
