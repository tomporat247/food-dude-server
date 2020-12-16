import * as express from 'express';
import { router } from './routes';
import { json } from 'body-parser';
import * as session from 'express-session';
import { errorMiddleware } from './middlewares/error';
import { get } from 'nconf';
import { authMiddleWare } from './middlewares/auth';

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
