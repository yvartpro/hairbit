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

        // Broadcast to salon and customer
        emitToRoom(`salon:${salonId}`, 'appointment:next', nextUp);
        emitToRoom(`customer:${nextUp.customer_id}`, 'appointment:active', nextUp);

        // Notify next person in line (position + 1) via Web Push
        const upcoming = await Appointment.findOne({
          where: { salon_id: salonId, status: 'WAITING' },
          order: [['position', 'ASC']],
        });

        if (upcoming) {
          const subs = await PushSubscription.findAll({ where: { customer_id: upcoming.customer_id, salon_id: salonId } });
          subs.forEach(sub => {
            sendPushNotification(sub, {
              title: 'Hairbit - You are next!',
              body: 'Please head to the salon, you are next in line.',
              url: `/salon/${salonId}`
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
