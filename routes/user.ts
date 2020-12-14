import { Router } from 'express';
import { isAdminMiddleWare, isAdminOrCurrentUserMiddleware } from '../middlewares/authentication';
import { getUsers, removeUser, updateUser } from '../controllers/user';
import { validateEmailParameter, validateUserUpdateBody } from '../middlewares/validators/user-validator';

export const userRouter = Router();

//@ts-ignore
userRouter.get('/', isAdminMiddleWare, getUsers);
//@ts-ignore
userRouter.delete('/:email', isAdminMiddleWare, validateEmailParameter, removeUser);
//@ts-ignore
userRouter.put('/:email', isAdminOrCurrentUserMiddleware, validateEmailParameter, validateUserUpdateBody, updateUser);
