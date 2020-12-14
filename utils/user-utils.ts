import { UserDocument } from '../models/user';
import { omit } from 'lodash';
import { RequestWithSession } from '../types/request-with-session';

export const getUserWithoutPrivateData = (user: UserDocument) => omit(user.toObject(), ['passwordHash', '_id']);

export const isCurrentUserAdmin = (req: RequestWithSession) => req.session?.user?.role === 'admin';
