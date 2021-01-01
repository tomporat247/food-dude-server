import * as socketIo from 'socket.io';
import * as http from 'http';
import { verifyAndDecodeToken } from './utils/auth-utils';
import { addToConnectedUsers, removeFromConnectedUsers } from './utils/connected-users-manager';
import { WebsocketEvent } from './types/websocket-events';

export const setupWebsocketServer = (server: http.Server) => {
  // @ts-ignore
  const io: socketIo.Server = socketIo(server, { cors: { origin: '*' } });

  io.on('connection', async (socket: socketIo.Socket) => {
    // @ts-ignore
    const token = socket.handshake.query.token;
    try {
      const user = await verifyAndDecodeToken(token);
      addToConnectedUsers(user, socket.id);

      socket.on('disconnect', () => removeFromConnectedUsers(user._id));
    } catch (e) {
      socket.emit(WebsocketEvent.AUTH_ERROR, `invalid user token: "${token}"`);
      socket.disconnect(true);
    }
  });
};
