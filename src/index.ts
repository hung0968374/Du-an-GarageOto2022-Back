import cors from 'cors';
import './modules/cronEngine/cron';
import ExpressApplication from './app';
import routes from './routers';
import env, { Environment } from './config/env';
import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import { socketService } from './common/services/SocketService';

const middleWares = [cors()];
const socketApp = express();

const app = new ExpressApplication({
  port:
    env.environment === Environment.Production
      ? parseInt(env.port)
      : parseInt(env.portLocal) || 8080,
  middleWares,
  routes,
});

const server = http.createServer(socketApp);
export const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

socketService(io);

server.listen(5001, () => {
  console.log('socketio is listening on *:5001');
});

app.listen();
