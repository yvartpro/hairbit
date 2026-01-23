import { Customer } from '../models/index.mjs';
import { sendOTP, verifyOTP, generateToken } from '../utils/auth.mjs';

class CustomerController {

  async login(req, res) {
    const { phone } = req.body;
    await sendOTP(phone);
    res.json({ message: 'OTP sent to mobile device' });
  }

  async verify(req, res) {
    const { phone, otp, name } = req.body;

    if (!verifyOTP(phone, otp)) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    let customer = await Customer.findOne({ where: { phone } });

    if (!customer) {
      if (!name) return res.status(400).json({ error: 'Name required for new customers' });
      customer = await Customer.create({ name, phone });
    }

    const token = generateToken({ id: customer.id, role: 'CUSTOMER' });
    res.json({ token, customer });
  }

  async getProfile(req, res) {
    try {
      const customer = await Customer.findByPk(req.user.id);
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new CustomerController();
