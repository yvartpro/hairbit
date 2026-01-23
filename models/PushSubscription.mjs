import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

/**
 * PushSubscription Model
 * Stores web push notification subscriptions for customers.
 */
const PushSubscription = sequelize.define('PushSubscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  salon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  endpoint: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  p256dh: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  auth: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'push_subscriptions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default PushSubscription;
