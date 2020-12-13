import { UserDocument } from '../models/user';
import { omit } from 'lodash';

export const getUserWithoutPrivateData = (user: UserDocument) => omit(user.toObject(), ['passwordHash', '_id']);
