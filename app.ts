import * as express from 'express';
import { router } from './routes';
import { json } from 'body-parser';
import * as session from 'express-session';
import { authenticationMiddleWare } from './middlewares/authentication';
import { errorMiddleware } from './middlewares/error';

export const app = express();

app.use(json());
app.use(
  session({
    secret: 'I AM BATMAN',
    resave: false,
    saveUninitialized: false
  })
);

app.use(authenticationMiddleWare);
app.use('/', router);
app.use(errorMiddleware);
