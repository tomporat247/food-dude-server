import { Router } from 'express';
import { authRouter } from './auth';
import { userRouter } from './user';
import { categoryRouter } from './category';
import { restaurantRouter } from './restaurant';
import { apiDocsRouter } from './api-docs';

export const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/restaurants', restaurantRouter);
router.use('/api-docs', apiDocsRouter);
