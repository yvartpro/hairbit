import express from 'express';
import PushSubscriptionController from '../controllers/PushSubscriptionController.mjs';

const router = express.Router();

router.post('/subscribe', PushSubscriptionController.subscribe);
router.post('/unsubscribe', PushSubscriptionController.unsubscribe);

export default router;
