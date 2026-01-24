import { PushSubscription } from '../models/index.mjs';

class PushSubscriptionController {

  async subscribe(req, res) {
    try {
      const { customer_id, salon_id, endpoint, p256dh, auth } = req.body;

      const [sub, created] = await PushSubscription.findOrCreate({
        where: { endpoint, customer_id, salon_id },
        defaults: {
          p256dh,
          auth,
        }
      });

      res.status(201).json(sub);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async unsubscribe(req, res) {
    try {
      const { endpoint } = req.body;
      await PushSubscription.destroy({ where: { endpoint } });
      res.json({ message: 'Unsubscribed successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PushSubscriptionController();
