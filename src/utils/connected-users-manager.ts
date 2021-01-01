import { User } from '../models/user';

const idToConnection: Record<string, { user: User; socketId: string }> = {};

export const addToConnectedUsers = (user: User, socketId: string) => (idToConnection[user._id] = { user, socketId });

export const removeFromConnectedUsers = (userId: string) => delete idToConnection[userId];

export const getConnections = () => Object.values(idToConnection);
