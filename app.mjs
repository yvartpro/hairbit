import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.mjs';
import { initSocket, getIO } from './utils/socket.mjs';

// Route Imports
import customerRoutes from './routes/CustomerRoutes.mjs';
import salonRoutes from './routes/SalonRoutes.mjs';
import userRoutes from './routes/UserRoutes.mjs';
import appointmentRoutes from './routes/AppointmentRoutes.mjs';
import subscriptionRoutes from './routes/PushSubscriptionRoutes.mjs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;
const API_BASE_URL = process.env.API_URL || 'http://localhost:4000/hairbit/api';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.IO
initSocket(httpServer);

// API Routes
app.use('/hairbit/api/customer', customerRoutes);
app.use('/hairbit/api/salon', salonRoutes);
app.use('/hairbit/api/user', userRoutes);
app.use('/hairbit/api/appointment', appointmentRoutes);
app.use('/hairbit/api/subscription', subscriptionRoutes);
app.use('/hairbit', express.static("public"))

// Health Check
app.get('/hairbit/api', (req, res) => {
  res.json({ status: 'Hairbit API is running', version: '1.0.0' });
});

app.get('/hairbit/api/debug/socket', (req, res) => {
  const io = getIO();
  res.json({
    initialized: !!io,
    path: io?.opts?.path || 'not set',
    clients: io?.engine?.clientsCount || 0
  });
});

// Database Sync and Server Start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connection has been established successfully.');

    httpServer.listen(PORT, () => {
      console.log(`[SERVER] Hairbit API running on ${API_BASE_URL}`)
    });
  } catch (error) {
    console.error('[SERVER] Unable to start server:', error);
  }
};

startServer()
