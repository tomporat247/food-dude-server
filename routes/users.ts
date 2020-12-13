import { Router } from 'express';
import { isAdminMiddleWare } from '../middlewares/authentication';
import { removeUser } from '../controllers/users';

export const userRouter = Router();

userRouter.delete('/:email', isAdminMiddleWare, removeUser);
