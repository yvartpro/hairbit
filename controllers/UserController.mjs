import { User, Salon } from '../models/index.mjs';
import { generateToken } from '../utils/auth.mjs';

class UserController {

  async login(req, res) {
    const { phone } = req.body;
    const user = await User.findOne({ where: { phone }, include: ['salon'] });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In proof of concept, we just issue token (assuming OTP happened or dummy)
    const token = generateToken({ id: user.id, salon_id: user.salon_id, role: user.role });
    res.json({ token, user });
  }

  async create(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async salonStaff(req, res) {
    const { salonId } = req.params;
    const staff = await User.findAll({ where: { salon_id: salonId } });
    res.json(staff);
  }
}

export default new UserController();
