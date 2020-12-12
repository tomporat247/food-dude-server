import * as objectHash from 'object-hash';
import { Response } from 'express';
import { RequestWithSession } from '../types/request-with-session';
import { omit } from 'lodash';
import { SignInUserArguments, SignUpUserArguments, User } from '../models/user';

const getUserWithoutPrivateData = (user: User) => omit(user, ['passwordHash'] as Array<keyof User>);

export const signUp = (req: RequestWithSession<SignUpUserArguments>, res: Response) => {
  const { email, password } = req.body;
  req.session.user = {
    email,
    passwordHash: objectHash(password),
    firstName: '',
    lastName: '',
    address: { city: '', houseNumber: 0, street: '' }
  };
  // TODO: Save user to mongo
  res.status(200).send(getUserWithoutPrivateData(req.session.user));
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
