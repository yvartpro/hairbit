import { Server } from 'socket.io';

let io;

/**
 * Initialize Socket.IO
 */
export const initSocket = (server) => {
  io = new Server(server, {
    path: '/hairbit/api/socket.io',
    pingTimeout: 60000, // 60 seconds grace period
    pingInterval: 25000, // Send ping every 25 seconds
    transports: ['polling', 'websocket'], // Allow both
    cors: {
      origin: (origin, callback) => {
        // Allow all origins for now to solve connection reset issues
        callback(null, true);
      },
      methods: ['GET', 'POST'],
      credentials: true
    },
    connectTimeout: 45000,
    allowEIO3: true,
    transports: ['polling', 'websocket']
  });

  io.on('connection', (socket) => {
    console.log(`[SOCKET] Client connected: ${socket.id} (Transport: ${socket.conn.transport.name})`);
    console.log(`[SOCKET] Handshake query:`, socket.handshake.query);

    socket.conn.on('upgrade', () => {
      console.log(`[SOCKET] Client ${socket.id} upgraded to ${socket.conn.transport.name}`);
    });

    // Join salon-specific room
    socket.on('join:salon', (salonId) => {
      socket.join(`salon:${salonId}`);
      console.log(`[SOCKET] Client ${socket.id} joined salon room: salon:${salonId}`);
    });

    // Join customer-specific room
    socket.on('join:customer', (customerId) => {
      socket.join(`customer:${customerId}`);
      console.log(`[SOCKET] Client ${socket.id} joined customer room: customer:${customerId}`);
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
    console.log(`[SOCKET] Broadcasting ${event} to ${room}`);
    io.to(room).emit(event, data);
  } else {
    console.warn(`[SOCKET] Cannot emit ${event} to ${room}: IO not initialized`);
  }
};

/**
 * Get IO Instance
 */
export const getIO = () => io;
