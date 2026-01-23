import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

/**
 * Salon Model
 * Represents a hair salon (tenant). Each salon has its own queue and staff.
 */
const Salon = sequelize.define('Salon', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, },
  name: {
    type: DataTypes.STRING, allowNull: false, validate: {
      notEmpty: true,
    },
  },
  phone: { type: DataTypes.STRING, },
  is_open: { type: DataTypes.BOOLEAN, defaultValue: true, },
  avg_service_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    comment: 'Average time in minutes for a haircut/service',
  },
}, {
  tableName: 'salons',
  timestamps: true,
  paranoid: true
});

export default Salon;
