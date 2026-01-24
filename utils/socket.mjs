import { Server } from 'socket.io';

let io;

/**
 * Initialize Socket.IO
 */
export const initSocket = (server) => {
  io = new Server(server, {
    path: '/hairbit/api/socket.io/',
    pingTimeout: 60000,
    pingInterval: 25000,
    cors: {
      origin: ['https://capbio.bi', 'http://localhost:3000', 'http://localhost:4000'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    connectTimeout: 45000,
    allowEIO3: true,
    transports: ['polling', 'websocket']
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id} (Transport: ${socket.conn.transport.name})`);

    socket.conn.on('upgrade', () => {
      console.log(`[SOCKET] Client ${socket.id} upgraded to ${socket.conn.transport.name}`);
    });

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
