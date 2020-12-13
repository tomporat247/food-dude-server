import { Router } from 'express';
import { isAdminMiddleWare, isAdminOrCurrentUserMiddleware } from '../middlewares/authentication';
import { removeUser, updateUser } from '../controllers/users';

export const userRouter = Router();

// TODO: Add validator: for this and all other (delete user - email, update user - email + partial user)
userRouter.delete('/:email', isAdminMiddleWare, removeUser);
userRouter.put('/:email', isAdminOrCurrentUserMiddleware, updateUser);
