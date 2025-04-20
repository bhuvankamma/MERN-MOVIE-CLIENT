import { Server } from 'socket.io';

let onlineUsers = {};

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on('register-user', ({ userId, role }) => {
      onlineUsers[userId] = { socketId: socket.id, role };
      console.log(`👤 Registered ${role}: ${userId}`);
    });

    socket.on('send-message', ({ userId, subject, message }) => {
      for (let id in onlineUsers) {
        if (onlineUsers[id].role === 'admin') {
          io.to(onlineUsers[id].socketId).emit('new-message', {
            userId,
            subject,
            message,
            timestamp: new Date(),
          });
        }
      }
    });

    socket.on('admin-reply', ({ userId, reply }) => {
      const userSocket = onlineUsers[userId];
      if (userSocket) {
        io.to(userSocket.socketId).emit('receive-reply', { reply });
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
      for (let id in onlineUsers) {
        if (onlineUsers[id].socketId === socket.id) {
          delete onlineUsers[id];
          break;
        }
      }
    });
  });
};
