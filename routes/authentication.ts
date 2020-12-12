import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/authentication';
import { validateUserSignIn, validateUserSignUp } from '../middlewares/validators/authentication-validator';

export const authenticationRouter = Router();

// @ts-ignore
authenticationRouter.post('/sign-in', validateUserSignIn, signIn);
// @ts-ignore
authenticationRouter.post('/sign-up', validateUserSignUp, signUp);
authenticationRouter.post('/sign-out', signOut);
