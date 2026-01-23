import express from 'express';
import SalonController from '../controllers/SalonController.mjs';

const router = express.Router();

router.get('/', SalonController.list);
router.get('/:id', SalonController.getOne);
router.post('/', SalonController.create);
router.patch('/:id/status', SalonController.updateStatus);

export default router;
