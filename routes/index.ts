import { Router } from 'express';
import { authenticationRouter } from './authentication';

export const router = Router();

router.use('/authentication', authenticationRouter);
