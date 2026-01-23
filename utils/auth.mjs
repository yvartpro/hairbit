import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET || 'hairbit_secret_key';

/**
 * Generate JWT for a user or customer
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

/**
 * Verify JWT
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid token' });
    }
    req.user = decoded;
    next();
  });
};

/**
 * Mock OTP Logic
 * In a real scenario, this would call an external SMS service.
 */
export const sendOTP = async (phone) => {
  console.log(`[AUTH] Sending OTP to ${phone}: 123456`);
  // Simulation: always returns true
  return true;
};

export const verifyOTP = (phone, code) => {
  // Simulation: hardcoded '123456' for testing
  return code === '123456';
};
