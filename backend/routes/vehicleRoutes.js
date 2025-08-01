import express from 'express';
import { vehicleEntry, vehicleExit, searchVehicle } from '../controllers/vehicleController.js';

const router = express.Router();

router.post('/entry', vehicleEntry);

router.post('/exit', vehicleExit);

router.post('/search', searchVehicle);

export default router;
