import {Server} from 'socket.io';

let io;

const init = httpServer => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });
  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

export {init, getIO};
