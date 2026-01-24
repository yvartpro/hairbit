import { Server } from 'socket.io';

let io;

/**
 * Initialize Socket.IO
 */
export const initSocket = (server) => {
  io = new Server(server, {
    path: '/hairbit/api/socket.io',
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id}`);

    // Join salon-specific room
    socket.on('join:salon', (salonId) => {
      socket.join(`salon:${salonId}`);
      console.log(`[SOCKET] Client joined salon room: salon:${salonId}`);
    });

    // Join customer-specific room
    socket.on('join:customer', (customerId) => {
      socket.join(`customer:${customerId}`);
      console.log(`[SOCKET] Client joined customer room: customer:${customerId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[SOCKET] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Broadcast event to a specific room
 */
export const emitToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

/**
 * Get IO Instance
 */
export const getIO = () => io;
