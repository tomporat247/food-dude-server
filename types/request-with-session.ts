import { Request } from 'express';
import { Session } from 'express-session';
import { UserDocument } from '../models/user';

interface FoodDudeSession {
  user: UserDocument;
}

export type RequestWithSession<T = any> = Request<any, any, T> & {
  session: Session & FoodDudeSession;
  sessionID: string;
};
