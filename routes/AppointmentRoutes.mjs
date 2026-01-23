import express from 'express';
import AppointmentController from '../controllers/AppointmentController.mjs';

const router = express.Router();

/**
 * @route   POST /appointments
 * @desc    Book a new appointment
 */
router.post('/', AppointmentController.book);

/**
 * @route   GET /appointments/salon/:salonId
 * @desc    Get all active appointments for a salon
 */
router.get('/salon/:salonId', AppointmentController.getQueue);

/**
 * @route   POST /appointments/salon/:salonId/next
 * @desc    Advance the queue for a salon
 */
router.post('/salon/:salonId/next', AppointmentController.next);

/**
 * @route   GET /appointments/customer/:customerId
 * @desc    Get all active appointments for a customer
 */
router.get('/customer/:customerId', AppointmentController.getCustomerAppointments);

/**
 * @route   PATCH /appointments/:id/cancel
 * @desc    Cancel an appointment
 */
router.patch('/:id/cancel', AppointmentController.cancel);

export default router;
