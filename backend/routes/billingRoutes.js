
import express from 'express';
import { 
  getAllBillingRecords, 
  getTotalRevenue,
  createBillingRecord,
  getLateVehicles
} from '../controllers/billingController.js';

const router = express.Router();
router.get('/create',createBillingRecord)
router.post('/records', getAllBillingRecords);

router.post('/revenue', getTotalRevenue);
router.get('/late', getLateVehicles);

export default router;
