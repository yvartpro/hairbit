import sequelize from '../config/database.mjs';
import Customer from './Customer.mjs';
import Salon from './Salon.mjs';
import User from './User.mjs';
import Appointment from './Appointment.mjs';
import PushSubscription from './PushSubscription.mjs';

// --- Associations ---

// Salon - User (1:N)
Salon.hasMany(User, { foreignKey: 'salon_id', as: 'staff' });
User.belongsTo(Salon, { foreignKey: 'salon_id', as: 'salon' });

// Salon - Appointment (1:N)
Salon.hasMany(Appointment, { foreignKey: 'salon_id', as: 'appointments' });
Appointment.belongsTo(Salon, { foreignKey: 'salon_id', as: 'salon' });

// Customer - Appointment (1:N)
Customer.hasMany(Appointment, { foreignKey: 'customer_id', as: 'appointments' });
Appointment.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Customer - PushSubscription (1:N)
Customer.hasMany(PushSubscription, { foreignKey: 'customer_id', as: 'subscriptions' });
PushSubscription.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// Salon - PushSubscription (1:N)
Salon.hasMany(PushSubscription, { foreignKey: 'salon_id' });
PushSubscription.belongsTo(Salon, { foreignKey: 'salon_id' });

export { sequelize, Customer, Salon, User, Appointment, PushSubscription };
