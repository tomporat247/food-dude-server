import { Router } from 'express';
import { signIn, signUp } from '../controllers/authentication';

export const authenticationRouter = Router();

authenticationRouter.post('/sign-in', signIn);
authenticationRouter.post('/sign-up', signUp);
