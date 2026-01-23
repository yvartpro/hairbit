import { sequelize, Salon, User, Customer, Appointment } from '../models/index.mjs';

const seedData = async () => {
  try {
    await sequelize.sync({ force: true }); // Careful: wipes your DB!
    console.log('[SEED] Database reset and synced.');

    // 1. Create Salons
    const salon1 = await Salon.create({
      name: 'The Modern Barber',
      phone: '+123456789',
      avg_service_duration: 30
    });

    const salon2 = await Salon.create({
      name: 'Elegance Salon & Spa',
      phone: '+987654321',
      avg_service_duration: 45
    });

    console.log('[SEED] Salons created.');

    // 2. Create Users (Staff)
    await User.create({
      name: 'John Doe',
      phone: '123456',
      role: 'OWNER',
      salon_id: salon1.id
    });

    await User.create({
      name: 'Jane Smith',
      phone: '654321',
      role: 'STAFF',
      salon_id: salon2.id
    });

    console.log('[SEED] Users created.');

    // 3. Create Sample Customers
    const customer1 = await Customer.create({ name: 'Alice', phone: '000111' });
    const customer2 = await Customer.create({ name: 'Bob', phone: '222333' });

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
