import { Router } from 'express';
import { isAdminMiddleWare, isAdminOrCurrentUserMiddleware } from '../middlewares/authentication';
import { removeUser, updateUser } from '../controllers/users';
import { validateEmailParameter, validateUserUpdateBody } from '../middlewares/validators/users-validator';

export const userRouter = Router();

//@ts-ignore
userRouter.delete('/:email', isAdminMiddleWare, validateEmailParameter, removeUser);
//@ts-ignore
userRouter.put('/:email', isAdminOrCurrentUserMiddleware, validateEmailParameter, validateUserUpdateBody, updateUser);
