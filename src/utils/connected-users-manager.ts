import { uniqBy } from 'lodash';
import { User } from '../models/user';

const socketIdToUser: Record<string, User> = {};

export const addToConnectedUsers = (socketId: string, user: User) => (socketIdToUser[socketId] = user);

export const removeFromConnectedUsers = (socketId: string) => delete socketIdToUser[socketId];

export const getConnectedUsersDisplayData = (unique = true): Array<Partial<User>> => {
  const connectedUsers = Object.values(socketIdToUser).map(({ _id, email }) => ({ _id, email }));
  return unique ? uniqBy(connectedUsers, '_id') : connectedUsers;
};
