import { RequestWithSession } from '../types/request-with-session';
import { NextFunction, Response } from 'express';
import { findAndUpdateUser, findUserById, findUsersForSearch, getAllUsers } from '../db/queries/user-queries';
import { FoodDudeError } from '../models/food-dude-error';
import { getUserWithoutPrivateData } from '../utils/user-utils';
import { UpdateUserArguments, UserSearchProperties } from '../models/user';
import { getConnectedUserIds } from '../utils/connected-users-manager';

export const getUsers = async (req: RequestWithSession<any, { email: string }>, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.send(users.map(getUserWithoutPrivateData));
  } catch (e) {
    next(e);
  }
};

export const removeUser = async (req: RequestWithSession<any, { id: string }>, res: Response, next: NextFunction) => {
  try {
    const userToDelete = await findUserById(req.params.id);

    if (userToDelete === null) {
      next(new FoodDudeError(`could not find user with id: "${req.params.id}"`, 404));
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
  req: RequestWithSession<Partial<UpdateUserArguments>, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedUser = await findAndUpdateUser(req.params.id, req.body);

    if (updatedUser === null) {
      next(new FoodDudeError(`could not find user with id: "${req.params.id}"`, 404));
    } else if (req.session.user._id.toString() === updatedUser._id.toString()) {
      req.session.user = updatedUser;
    }
    res.send(getUserWithoutPrivateData(updatedUser));
  } catch (e) {
    next(
      e?.code === 11000
        ? new FoodDudeError(`Received duplicate key for field "${Object.keys(e.keyPattern)[0]}"`, 400)
        : e
    );
  }
};

export const searchUsers = async (
  req: RequestWithSession<any, any, UserSearchProperties>,
  res: Response,
  next: NextFunction
) => {
  try {
    const searchResults = await findUsersForSearch(
      req.query,
      req.query.currentlyLoggedIn ? Array.from(getConnectedUserIds()) : undefined
    );
    res.send(searchResults);
  } catch (e) {
    next(e);
  }
};
