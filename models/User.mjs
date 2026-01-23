import { DataTypes } from 'sequelize';
import sequelize from '../config/database.mjs';

/**
 * User Model
 * Represents salon staff or owners who manage the queue.
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('OWNER', 'STAFF'),
    defaultValue: 'STAFF',
  },
  salon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'hairbit_users',
  timestamps: true,
  paranoid: true
});

export default User;
