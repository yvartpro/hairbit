import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

/**
 * Appointment Model
 * Represents a spot in the queue.
 */
const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  salon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Queue position sequence',
  },
  status: {
    type: DataTypes.ENUM('WAITING', 'IN_PROGRESS', 'DONE', 'CANCELLED'),
    defaultValue: 'WAITING',
  },
  booked_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  started_at: {
    type: DataTypes.DATE,
  },
  finished_at: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Appointment;
