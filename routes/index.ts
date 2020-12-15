import { Router } from 'express';
import { authenticationRouter } from './authentication';
import { userRouter } from './user';
import { categoryRouter } from './category';
import { restaurantRouter } from './restaurant';
import { apiDocsRouter } from './api-docs';

export const router = Router();

router.use('/authentication', authenticationRouter);
router.use('/users', userRouter);
router.use('/categories', categoryRouter);
router.use('/restaurants', restaurantRouter);
router.use('/api-docs', apiDocsRouter);
