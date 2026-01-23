import express from 'express';
import CustomerController from '../controllers/CustomerController.mjs';
import { verifyToken } from '../utils/auth.mjs';

const router = express.Router();

router.post('/login', CustomerController.login);
router.post('/verify', CustomerController.verify);
router.get('/me', verifyToken, CustomerController.getProfile);

export default router;
