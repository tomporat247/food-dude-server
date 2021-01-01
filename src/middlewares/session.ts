import * as session from 'express-session';
import { get } from 'nconf';

export const sessionMiddleWare = session({
  secret: get('auth:secret'),
  resave: false,
  saveUninitialized: false
});
