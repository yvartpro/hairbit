import { PushSubscription } from '../models/index.mjs';

class PushSubscriptionController {

  async subscribe(req, res) {
    try {
      const { customer_id, salon_id, subscription } = req.body;
      const { endpoint, keys } = subscription;

      const [sub, created] = await PushSubscription.findOrCreate({
        where: { endpoint, customer_id, salon_id },
        defaults: {
          p256dh: keys.p256dh,
          auth: keys.auth,
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
