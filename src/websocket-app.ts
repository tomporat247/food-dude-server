import * as socketIo from 'socket.io';
import * as http from 'http';
import { verifyAndDecodeToken } from './utils/auth-utils';
import {
  addToConnectedUsers,
  getConnectedUsersDisplayData,
  removeFromConnectedUsers
} from './utils/connected-users-manager';
import { WebsocketClientEvent, WebsocketServerEvent } from './types/websocket-events';
import { User } from './models/user';
import { WebsocketRoom } from './types/websocket-rooms';
import { findRestaurantById } from './db/queries/restaurant-queries';
import { validateObjectId } from './middlewares/validators/common-validators';
import { RestaurantDocument } from './models/restaurant';

let io: socketIo.Server;

const validateId = (id: string, socket: socketIo.Socket): boolean => {
  try {
    validateObjectId(id);
    return true;
  } catch (e) {
    socket.emit(WebsocketServerEvent.INPUT_ERROR, `invalid id: ${id}`);
    return false;
  }
};

const verifyAdmin = (socket: socketIo.Socket, user: User, onErrorArgs: any) => {
  if (user.role !== 'admin') {
    socket.emit(WebsocketServerEvent.ONLY_ADMIN_PERMITTED, onErrorArgs);
    throw new Error(`${WebsocketServerEvent.ONLY_ADMIN_PERMITTED}: args: ${JSON.stringify(onErrorArgs)}`);
  }
};

const emitConnectedUsersChange = () =>
  io.to(WebsocketRoom.ADMIN).emit(WebsocketServerEvent.CONNECTED_USERS, getConnectedUsersDisplayData({ unique: true }));

const emitBlockRestaurantReviewsChanged = (restaurantId: string, reviewsBlocked: boolean) =>
  io.emit(WebsocketServerEvent.BLOCK_RESTAURANT_REVIEWS_CHANGED, { restaurantId, reviewsBlocked });

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

const updateRestaurantReviewsBlocked = async (restaurant: RestaurantDocument, block: boolean) => {
  restaurant.reviewsBlocked = block;
  await restaurant.save();
  emitBlockRestaurantReviewsChanged(restaurant._id.toString(), block);
};

const onBlockRestaurantReviewsChange = async (
  socket: socketIo.Socket,
  user: User,
  restaurantId: string,
  block: boolean
) => {
  if (validateId(restaurantId, socket)) {
    try {
      verifyAdmin(socket, user, { onEvent: WebsocketClientEvent.CHANGE_BLOCK_RESTAURANT_REVIEWS });
      const restaurant = await findRestaurantById(restaurantId);
      if (restaurant === null) {
        socket.emit(WebsocketServerEvent.INPUT_ERROR, `no restaurant found for id: ${restaurantId}`);
      } else if (restaurant.reviewsBlocked !== block) {
        await updateRestaurantReviewsBlocked(restaurant, block);
      }
    } catch (e) {
      socket.emit(WebsocketServerEvent.INTERNAL_SERVER_ERROR);
    }
  }
};

const onAuthError = (socket: socketIo.Socket, givenToken: string) => {
  socket.emit(WebsocketServerEvent.AUTH_ERROR, `invalid user token: "${givenToken}"`);
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

      socket.on(
        WebsocketClientEvent.CHANGE_BLOCK_RESTAURANT_REVIEWS,
        ({ restaurantId, block }: { restaurantId: string; block: boolean }) =>
          onBlockRestaurantReviewsChange(socket, user, restaurantId, block)
      );

      socket.emit('lilach', { a: 'b' });

      socket.on('disconnect', () => onUserDisconnected(socket));
    } catch (e) {
      onAuthError(socket, token);
    }
  });
};
