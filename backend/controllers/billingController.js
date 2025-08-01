// src/controllers/billingController.js
import Billing from '../models/Billing.js';

const createBillingRecord = async (sessionData) => {
  try {
    const { session, billingAmount } = sessionData;
    
    const durationMs = new Date(session.exit_time) - new Date(session.entry_time);
    const durationHours = parseFloat((durationMs / (1000 * 60 * 60)).toFixed(2));
    
    let isLate = false;
    if (session.billing_type === 'daypass') {
      const entryDate = new Date(session.entry_time);
      const exitDate = new Date(session.exit_time);
      
      const mallClosingTime = new Date(entryDate);
      mallClosingTime.setHours(22, 0, 0, 0);
      
      if (exitDate > mallClosingTime) {
        isLate = true;
        const lateHours = Math.ceil((exitDate - mallClosingTime) / (1000 * 60 * 60));
        console.log(` ADMIN ALERT: Vehicle ${session.vehicle_id.number_plate} at slot ${session.slot_id.slot_number} is ${lateHours} hour(s) late! Mall closed at 10 PM.`);
      }
    }
    
    const billingRecord = new Billing({
      session_id: session._id,
      vehicle_number: session.vehicle_id.number_plate,
      vehicle_type: session.vehicle_id.type,
      slot_number: session.slot_id.slot_number,
      entry_time: session.entry_time,
      exit_time: session.exit_time,
      billing_type: session.billing_type,
      total_amount: billingAmount,
      duration_hours: durationHours,
      is_late: isLate
    });
    
    await billingRecord.save();
    return billingRecord;
    
  } catch (error) {
    console.error('Error creating billing record:', error);
    throw error;
  }
};

const getAllBillingRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const skip = (page - 1) * limit;
    
    const billingRecords = await Billing.find()
      .sort({ exit_time: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    const total = await Billing.countDocuments();
    
    res.json({
      success: true,
      data: billingRecords,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const getTotalRevenue = async (req, res) => {
  try {
    const result = await Billing.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total_amount' }
        }
      }
    ]);
    
    res.json({
      success: true,
      totalRevenue: result[0]?.totalRevenue || 0
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const getLateVehicles = async (req, res) => {
  try {
    const lateVehicles = await Billing.find({ 
      is_late: true,
      billing_type: 'daypass'
    })
    .sort({ exit_time: -1 })
    .limit(20);
    
    res.json({
      success: true,
      data: lateVehicles
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export { 
  createBillingRecord, 
  getAllBillingRecords, 
  getTotalRevenue,
  getLateVehicles
};
