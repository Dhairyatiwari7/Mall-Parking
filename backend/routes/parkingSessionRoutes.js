import express from 'express';
import { getActiveSessions } from '../controllers/parkingSessionController.js';

const router = express.Router();

router.get('/active', getActiveSessions);

export default router;
