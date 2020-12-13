import { Request } from 'express';
import { Session } from 'express-session';
import { UserDocument } from '../models/user';

interface FoodDudeSession {
  user: UserDocument;
}

export type RequestWithSession<ReqBody = any, Params = any> = Request<Params, any, ReqBody> & {
  session: Session & FoodDudeSession;
  sessionID: string;
};
