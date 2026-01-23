import { Salon } from '../models/index.mjs';

class SalonController {

  async list(req, res) {
    try {
      const salons = await Salon.findAll({ where: { is_open: true } });
      res.json(salons);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOne(req, res) {
    try {
      const salon = await Salon.findByPk(req.params.id);
      if (!salon) return res.status(404).json({ error: 'Salon not found' });
      res.json(salon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const salon = await Salon.create(req.body);
      res.status(201).json(salon);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const { is_open } = req.body;
      await Salon.update({ is_open }, { where: { id: req.params.id } });
      res.json({ message: 'Salon status updated' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new SalonController();
