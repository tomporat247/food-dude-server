import { Request } from 'express';
import { Session } from 'express-session';
import { User } from '../models/user';

interface FoodDudeSession {
  user: User;
}

export type RequestWithSession<T = any> = Request<any, any, T> & {
  session: Session & FoodDudeSession;
  sessionID: string;
};
