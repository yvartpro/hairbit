import express from 'express';
import UserController from '../controllers/UserController.mjs';

const router = express.Router();

router.post('/login', UserController.login);
router.post('/', UserController.create);
router.get('/salon/:salonId', UserController.salonStaff);

export default router;
