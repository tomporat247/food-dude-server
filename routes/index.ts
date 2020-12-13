import { Router } from 'express';
import { authenticationRouter } from './authentication';
import { userRouter } from './users';

export const router = Router();

router.use('/authentication', authenticationRouter);
router.use('/users', userRouter);
