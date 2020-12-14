import { UserDocument } from '../models/user';
import { RequestWithSession } from '../types/request-with-session';
import { getDocumentWithoutIrrelevantFields } from './common-utils';

export const getUserWithoutPrivateData = (user: UserDocument) =>
  getDocumentWithoutIrrelevantFields(user, ['passwordHash']);

export const isCurrentUserAdmin = (req: RequestWithSession) => req.session?.user?.role === 'admin';
