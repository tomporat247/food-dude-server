import { Router } from 'express';
import { login, signUp } from '../controllers/auth';
import { validateUserLoginBody, validateUserRegisterBody } from '../middlewares/validators/auth-validator';

export const authRouter = Router();

// @ts-ignore
authRouter.post('/login', validateUserLoginBody, login);
// @ts-ignore
authRouter.post('/register', validateUserRegisterBody, signUp);
