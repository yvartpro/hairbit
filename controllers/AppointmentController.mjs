import { Appointment, Customer, Salon } from '../models/index.mjs';
import { emitToRoom } from '../utils/socket.mjs';
import { sendPushNotification } from '../utils/push.mjs';
import { PushSubscription } from '../models/index.mjs';

/**
 * Appointment Controller
 * Handles queue management and real-time updates.
 */
class AppointmentController {

  /**
   * Book an appointment
   */
  async book(req, res) {
    try {
      const { customer_id, salon_id } = req.body;

      // Calculate next position in queue for this salon
      const lastAppointment = await Appointment.findOne({
        where: { salon_id, status: 'WAITING' },
        order: [['position', 'DESC']],
      });

      const nextPosition = lastAppointment ? lastAppointment.position + 1 : 1;

      const appointment = await Appointment.create({
        customer_id,
        salon_id,
        position: nextPosition,
        status: 'WAITING',
      });

      // Broadcast update to salon room
      emitToRoom(`salon:${salon_id}`, 'queue:update', { type: 'BOOKED', appointment });

      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get queue for a salon
   */
  async getQueue(req, res) {
    try {
      const { salonId } = req.params;
      const queue = await Appointment.findAll({
        where: { salon_id: salonId, status: ['WAITING', 'IN_PROGRESS'] },
        include: [{ model: Customer, as: 'customer', attributes: ['name', 'phone'] }],
        order: [['position', 'ASC']],
      });
      res.json(queue);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get appointments for a customer
   */
  async getCustomerAppointments(req, res) {
    try {
      const { customerId } = req.params;
      const appointments = await Appointment.findAll({
        where: { customer_id: customerId },
        include: [{ model: Salon, as: 'salon', attributes: ['name', 'phone'] }],
        order: [['created_at', 'DESC']],
      });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Move to next appointment
   */
  async next(req, res) {
    try {
      const { salonId } = req.params;

      // 1. Mark current IN_PROGRESS as DONE
      await Appointment.update(
        { status: 'DONE', finished_at: new Date() },
        { where: { salon_id: salonId, status: 'IN_PROGRESS' } }
      );

      // 2. Find next WAITING and set to IN_PROGRESS
      const nextUp = await Appointment.findOne({
        where: { salon_id: salonId, status: 'WAITING' },
        order: [['position', 'ASC']],
      });

      if (nextUp) {
        nextUp.status = 'IN_PROGRESS';
        nextUp.started_at = new Date();
        await nextUp.save();

        console.log(`[QUEUE] Advancing queue for salon ${salonId}. Next up: Customer ${nextUp.customer_id}`);
        // 1. Notify Customer being served (Socket + Push)
        console.log(`[SOCKET] Emitting appointment:next to salon:${salonId}`);
        emitToRoom(`salon:${salonId}`, 'appointment:next', nextUp);

        console.log(`[SOCKET] Emitting appointment:active to customer:${nextUp.customer_id}`);
        emitToRoom(`customer:${nextUp.customer_id}`, 'appointment:active', nextUp);

        const currentSubs = await PushSubscription.findAll({ where: { customer_id: nextUp.customer_id, salon_id: salonId } });
        console.log(`[PUSH] Found ${currentSubs.length} subscriptions for customer ${nextUp.customer_id}`);
        currentSubs.forEach(sub => {
          sendPushNotification(sub, {
            title: 'Hairbit - It\'s your turn!',
            body: 'Please head to the counter now. We are ready for you!',
            url: '/hairbit'
          });
        });

        // 2. Notify the NEXT person in line (upcoming)
        const upcoming = await Appointment.findOne({
          where: { salon_id: salonId, status: 'WAITING' },
          order: [['position', 'ASC']],
        });

        if (upcoming) {
          console.log(`[QUEUE] Upcoming customer: ${upcoming.customer_id}`);
          const upcomingSubs = await PushSubscription.findAll({ where: { customer_id: upcoming.customer_id, salon_id: salonId } });
          console.log(`[PUSH] Found ${upcomingSubs.length} subscriptions for upcoming customer ${upcoming.customer_id}`);
          upcomingSubs.forEach(sub => {
            sendPushNotification(sub, {
              title: 'Hairbit - You are next!',
              body: 'You are now next in line. Please stay close.',
              url: '/hairbit'
            });
          });
        }
      }

      // Broadcast general queue update
      emitToRoom(`salon:${salonId}`, 'queue:update', { type: 'SHIFT' });

      res.json({ message: 'Queue advanced', current: nextUp });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Cancel appointment
   */
  async cancel(req, res) {
    try {
      const { id } = req.params;
      const appointment = await Appointment.findByPk(id);

      if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

      appointment.status = 'CANCELLED';
      await appointment.save();

      emitToRoom(`salon:${appointment.salon_id}`, 'appointment:cancelled', { id });
      emitToRoom(`salon:${appointment.salon_id}`, 'queue:update', { type: 'CANCELLED' });

      res.json({ message: 'Appointment cancelled' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AppointmentController();
