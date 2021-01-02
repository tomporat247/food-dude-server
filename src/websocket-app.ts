import * as socketIo from 'socket.io';
import * as http from 'http';
import { verifyAndDecodeToken } from './utils/auth-utils';
import {
  addToConnectedUsers,
  getConnectedUsersDisplayData,
  removeFromConnectedUsers
} from './utils/connected-users-manager';
import { WebsocketEvent } from './types/websocket-events';
import { User } from './models/user';
import { WebsocketRoom } from './types/websocket-rooms';

let io: socketIo.Server;

const emitConnectedUsersChange = () =>
  io.to(WebsocketRoom.ADMIN).emit(WebsocketEvent.CONNECTED_USERS, getConnectedUsersDisplayData({ unique: true }));

const addSocketToRelevantRooms = (socket: socketIo.Socket, user: User) => {
  if (user.role === 'admin') {
    socket.join(WebsocketRoom.ADMIN);
  }
};

const onUserConnected = (socket: socketIo.Socket, user: User) => {
  addSocketToRelevantRooms(socket, user);
  addToConnectedUsers(socket.id, user);
  emitConnectedUsersChange();
};

const onUserDisconnected = (socket: socketIo.Socket) => {
  removeFromConnectedUsers(socket.id);
  emitConnectedUsersChange();
};

const onAuthError = (socket: socketIo.Socket, givenToken: string) => {
  socket.emit(WebsocketEvent.AUTH_ERROR, `invalid user token: "${givenToken}"`);
  socket.disconnect(true);
};

export const setupWebsocketServer = (server: http.Server) => {
  // @ts-ignore
  io = socketIo(server, { cors: { origin: '*' } });

  io.on('connection', async (socket: socketIo.Socket) => {
    // @ts-ignore
    const token = socket.handshake?.query?.token;
    try {
      const user = await verifyAndDecodeToken(token);
      onUserConnected(socket, user);

      socket.on('disconnect', () => onUserDisconnected(socket));
    } catch (e) {
      onAuthError(socket, token);
    }
  });
};
