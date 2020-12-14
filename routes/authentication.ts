import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/authentication';
import { validateUserSignInBody, validateUserSignUpBody } from '../middlewares/validators/authentication-validator';

export const authenticationRouter = Router();

// @ts-ignore
authenticationRouter.post('/sign-in', validateUserSignInBody, signIn);
// @ts-ignore
authenticationRouter.post('/sign-up', validateUserSignUpBody, signUp);
authenticationRouter.post('/sign-out', signOut);
