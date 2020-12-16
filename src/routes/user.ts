import { Router } from 'express';
import { isAdminMiddleWare, isAdminOrCurrentUserMiddleware } from '../middlewares/auth';
import { getCurrentUser, getUsers, removeUser, updateUser } from '../controllers/user';
import { validateUserUpdateBody } from '../middlewares/validators/user-validator';
import { validateObjectIdParameter } from '../middlewares/validators/common-validators';

export const userRouter = Router();

//@ts-ignore
userRouter.get('/', isAdminMiddleWare, getUsers);
userRouter.get('/current', getCurrentUser);
//@ts-ignore
userRouter.delete('/:id', isAdminMiddleWare, validateObjectIdParameter, removeUser);
//@ts-ignore
userRouter.put('/:id', isAdminOrCurrentUserMiddleware, validateObjectIdParameter, validateUserUpdateBody, updateUser);
