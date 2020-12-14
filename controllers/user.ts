import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import { findAndUpdateUser, findUserByEmail } from '../db/queries/user-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { getUserWithoutPrivateData } from '../utils/user-utils';
import { UpdateUserArguments } from '../models/user';

export const removeUser = async (
  req: RequestWithSession<any, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToDelete = await findUserByEmail(req.params.email);

    if (userToDelete === null) {
      next(new FoodDudeError(`could not find user with email: "${req.params.email}"`, 400));
    } else if (userToDelete._id.toString() === req.session.user._id.toString()) {
      next(new FoodDudeError('cannot remove own user', 400));
    } else {
      await userToDelete.remove();
      res.send(getUserWithoutPrivateData(userToDelete));
    }
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (
  req: RequestWithSession<Partial<UpdateUserArguments>, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await findAndUpdateUser(req.params.email, req.body);

    if (updatedUser === null) {
      next(new FoodDudeError(`could not find user with email: "${req.params.email}"`, 400));
    } else if (req.session.user._id.toString() === updatedUser._id.toString()) {
      req.session.user = updatedUser;
    }
    res.send(getUserWithoutPrivateData(updatedUser));
  } catch (e) {
    next(e);
  }
};
