import * as express from 'express';
import { router } from './src/routes';
import { json } from 'body-parser';
import * as session from 'express-session';
import { errorMiddleware } from './src/middlewares/error';
import { get } from 'nconf';
import { authMiddleWare } from './src/middlewares/auth';

export const app = express();

app.use(json());
app.use(
  session({
    secret: get('auth:secret'),
    resave: false,
    saveUninitialized: false
  })
);

app.use(authMiddleWare);
app.use('/', router);
app.use(errorMiddleware);
