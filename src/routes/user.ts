import { Router } from 'express';
import { isAdminMiddleWare, isAdminOrCurrentUserMiddleware } from '../middlewares/auth';
import { getUsers, removeUser, searchUsers, updateUser } from '../controllers/user';
import { validateUserSearchQueryParameters, validateUserUpdateBody } from '../middlewares/validators/user-validator';
import { getParameterObjectIdValidator } from '../middlewares/validators/common-validators';

export const userRouter = Router();

//@ts-ignore
userRouter.get('/', isAdminMiddleWare, getUsers);
//@ts-ignore
userRouter.get('/search', isAdminMiddleWare, validateUserSearchQueryParameters, searchUsers);
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
