import * as socketIo from 'socket.io';
import * as http from 'http';
import {sessionMiddleWare} from "./middlewares/session";

export const setupWebsocketServer = (server: http.Server) => {
  // @ts-ignore
  const io: socketIo.Server = socketIo(server, { cors: { origin: '*' } });

  // @ts-ignore
  io.use((socket, next) => sessionMiddleWare(socket.request, socket.request.res || {}, next))

  io.on('connection', socket => console.log('a user connected'));
};
