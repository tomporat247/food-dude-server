import * as express from 'express';
import { router } from './routes';
import { json } from 'body-parser';

export const app = express();

app.use(json());
app.use('/', router);
