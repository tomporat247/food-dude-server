import * as express from 'express';
import * as cors from 'cors';
import { router } from './routes';
import { json } from 'body-parser';
import { errorMiddleware } from './middlewares/error';
import { authMiddleWare } from './middlewares/auth';
import { sessionMiddleWare } from './middlewares/session';

export const app = express();

app.use(cors());
app.use(json());
app.use(sessionMiddleWare);
app.use(authMiddleWare);
app.use('/', router);
app.use(errorMiddleware);
