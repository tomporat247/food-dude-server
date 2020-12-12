import * as express from 'express';

export const app = express();

app.use((req, res) => res.send('up'))
