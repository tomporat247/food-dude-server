import { Router } from 'express';
import { isAdminMiddleWare, isAdminOrCurrentUserMiddleware } from '../middlewares/auth';
import { getCurrentUser, getUsers, removeUser, updateUser } from '../controllers/user';
import { validateUserUpdateBody } from '../middlewares/validators/user-validator';
import { getParameterObjectIdValidator } from '../middlewares/validators/common-validators';

export const userRouter = Router();

//@ts-ignore
userRouter.get('/', isAdminMiddleWare, getUsers);
userRouter.get('/current', getCurrentUser);
//@ts-ignore
userRouter.delete('/:id', isAdminMiddleWare, getParameterObjectIdValidator('id'), removeUser);
userRouter.put(
  '/:id',
  isAdminOrCurrentUserMiddleware,
  //@ts-ignore
  getParameterObjectIdValidator('id'),
  validateUserUpdateBody,
  updateUser
);
