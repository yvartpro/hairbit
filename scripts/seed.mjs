import { sequelize, Salon, User, Customer, Appointment } from '../models/index.mjs';

const seedData = async () => {
  try {
    await sequelize.sync({ force: false }) // don't force sync
    console.log('[SEED] Database synced.');

    // 1. Create Salons
    const salon1 = await Salon.create({
      name: 'Anny Beauty Salon',
      phone: '+123456789',
      avg_service_duration: 30
    });

    const salon2 = await Salon.create({
      name: 'Modern Salon & Spa',
      phone: '+987654321',
      avg_service_duration: 45
    });

    console.log('[SEED] Salons created.');

    // 2. Create Users (Staff)
    await User.create({ name: 'Anny Bella', phone: '79100037', role: 'OWNER', salon_id: salon1.id });
    await User.create({ name: 'John Smith', phone: '65234567', role: 'STAFF', salon_id: salon2.id });

    console.log('[SEED] Users created.');

    // 3. Create Sample Customers
    const customer1 = await Customer.create({ name: 'Nikita Jane', phone: '12345678' });
    const customer2 = await Customer.create({ name: 'Ineza Ninette', phone: '87654321' });

    console.log('[SEED] Customers created.');

    // 4. Create Sample Appointments
    await Appointment.create({
      salon_id: salon1.id,
      customer_id: customer1.id,
      position: 1,
      status: 'WAITING'
    });

    await Appointment.create({
      salon_id: salon1.id,
      customer_id: customer2.id,
      position: 2,
      status: 'WAITING'
    });

    console.log('[SEED] Sample appointments created.');

    console.log('[SEED] Seeding complete! Control+C to exit.');
    process.exit(0);
  } catch (error) {
    console.error('[SEED] Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
