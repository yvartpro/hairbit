import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.mjs';
import { initSocket } from './utils/socket.mjs';

// Route Imports
import customerRoutes from './routes/CustomerRoutes.mjs';
import salonRoutes from './routes/SalonRoutes.mjs';
import userRoutes from './routes/UserRoutes.mjs';
import appointmentRoutes from './routes/AppointmentRoutes.mjs';
import subscriptionRoutes from './routes/PushSubscriptionRoutes.mjs';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.IO
initSocket(httpServer);

// API Routes
app.use('/customers', customerRoutes);
app.use('/salons', salonRoutes);
app.use('/users', userRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/subscriptions', subscriptionRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'Hairbit API is running', version: '1.0.0' });
});

// Database Sync and Server Start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('[DB] Connection has been established successfully.');

    // In production, use migrations instead of { alter: true }
    await sequelize.sync({ alter: true });
    console.log('[DB] Models synchronized.');

    httpServer.listen(PORT, () => {
      console.log(`[SERVER] Hairbit API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[SERVER] Unable to start server:', error);
  }
};

startServer();
