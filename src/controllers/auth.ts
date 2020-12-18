import * as objectHash from 'object-hash';
import { sign } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { RequestWithSession } from '../types/request-with-session';
import { SignInUserArguments, SignUpUserArguments, User, UserDocument } from '../models/user';
import { createUser, findUserByEmailAndPassword } from '../db/queries/user-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { get } from 'nconf';
import { getUserWithoutPrivateData } from '../utils/user-utils';

const accessTokenSecret = get('auth:secret');

const generateAccessToken = (user: UserDocument) => sign(getUserWithoutPrivateData(user), accessTokenSecret);

export const register = async (req: RequestWithSession<SignUpUserArguments>, res: Response, next: NextFunction) => {
  try {
    const { password, ...userData } = req.body;
    const newUserData: User = { ...userData, role: 'viewer', passwordHash: objectHash(password) };

    const user = await createUser(newUserData);
    res.send(generateAccessToken(user));
  } catch (e) {
    next(e.code === 11000 ? new FoodDudeError(`"${req.body.email}" email is taken by another user`, 403) : e);
  }
};

export const login = async (req: RequestWithSession<SignInUserArguments>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmailAndPassword(email, objectHash(password));
    if (user === null) {
      next(new FoodDudeError('no match for user with given credentials', 404));
    } else {
      res.send(generateAccessToken(user));
    }
  } catch (e) {
    next(e);
  }
};
