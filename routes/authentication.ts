import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/authentication';

export const authenticationRouter = Router();

authenticationRouter.post('/sign-in', signIn);
authenticationRouter.post('/sign-up', signUp);
authenticationRouter.post('/sign-out', signOut);
