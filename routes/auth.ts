import { Router } from 'express';
import { signIn, signOut, signUp } from '../controllers/auth';
import { validateUserSignInBody, validateUserSignUpBody } from '../middlewares/validators/auth-validator';

export const authRouter = Router();

// @ts-ignore
authRouter.post('/sign-in', validateUserSignInBody, signIn);
// @ts-ignore
authRouter.post('/sign-up', validateUserSignUpBody, signUp);
authRouter.post('/sign-out', signOut);
