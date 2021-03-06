#!/usr/bin/env node

import '../../config/init';
import { app } from '../app';
import * as http from 'http';
import { get } from 'nconf';
import { connectToDB } from '../db/connect';
import { setupWebsocketServer } from '../websocket-app';

const port = normalizePort(process.env.PORT || get('port') || '3000');
let server: http.Server;

const runServer = async () => {
  app.set('port', port);

  await connectToDB();

  server = http.createServer(app);
  setupWebsocketServer(server);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
};

runServer();

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
