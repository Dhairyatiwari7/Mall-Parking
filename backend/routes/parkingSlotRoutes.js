import express from 'express';
import { setSlotMaintenance, setSlotAvailable, getSlots, getDashboardStats } from '../controllers/parkingSlotController.js';

const router = express.Router();

router.post('/:id/maintenance', setSlotMaintenance);

router.post('/:id/available', setSlotAvailable);

router.post('/list', getSlots);
router.post('/dashboard-stats', getDashboardStats);

export default router;
