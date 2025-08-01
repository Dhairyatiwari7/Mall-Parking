import Vehicle from "../models/Vehicle.js";
import ParkingSession from "../models/ParkingSession.js";
import { createBillingRecord } from './billingController.js';
import ParkingSlot from "../models/ParkingSlot.js";

const vehicleEntry = async (req, res) => {
  try {
    const { number_plate, type, billing_type, preferred_slot_id } = req.body;

    let vehicle = await Vehicle.findOne({ number_plate });
    if (!vehicle) {
      vehicle = await Vehicle.create({ number_plate, type });
    }

    let allowedSlotTypes;
    switch (type) {
      case 'Bike':
        allowedSlotTypes = ['Bike'];
        break;
      case 'EV':
        allowedSlotTypes = ['EV'];
        break;
      case 'Handicap Accessible':
        allowedSlotTypes = ['Handicap Accessible'];
        break;
      default:
        allowedSlotTypes = ['Regular', 'Compact'];
    }

    let slot;

    if (preferred_slot_id) {
      slot = await ParkingSlot.findById(preferred_slot_id);
      if (!slot) {
        return res.status(400).json({ error: 'Preferred slot not found.' });
      }

      if (!allowedSlotTypes.includes(slot.type)) {
        return res.status(400).json({ error: `Preferred slot type '${slot.type}' is not allowed for vehicle type '${type}'.` });
      }

      if (slot.status !== 'Available' && slot.status !== 'Maintenance') {
        return res.status(400).json({ error: `Preferred slot is currently not available (status: ${slot.status}).` });
      }
    } else {
      slot = await ParkingSlot.findOne({ type: { $in: allowedSlotTypes }, status: 'Available' });
      if (!slot) {
        return res.status(400).json({ error: 'No available slot for this vehicle type.' });
      }
    }

    slot.status = 'Occupied';
    await slot.save();

    const session = await ParkingSession.create({
      vehicle_id: vehicle._id,
      slot_id: slot._id,
      billing_type
    });

    res.json({
      message: 'Vehicle parked successfully',
      slot: slot.slot_number,
      session_id: session._id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const vehicleExit = async (req, res) => {
  try {
    const { number_plate } = req.body;

    const vehicle = await Vehicle.findOne({ number_plate });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found!' });

    const session = await ParkingSession.findOne({ 
      vehicle_id: vehicle._id, 
      status: 'Active' 
    }).populate('slot_id').populate('vehicle_id');
    
    if (!session) return res.status(404).json({ error: 'No active session found for this vehicle.' });

    session.exit_time = new Date();
    session.status = 'Completed';

    let amount = 0;
    if (session.billing_type === 'hourly') {
      const durationMs = session.exit_time - session.entry_time;
      const hours = Math.ceil(durationMs / (1000 * 60 * 60));

      if (hours <= 1) {
        amount = 50;
      } else if (hours <= 3) {
        amount = 100;
      } else if (hours <= 6) {
        amount = 150;
      } else {
        amount = 200;
      }
    } else if (session.billing_type === 'daypass') {
      amount = 150;
    }

    session.billing_amount = amount;
    await session.save();

    // Create billing record with late detection
    const billingRecord = await createBillingRecord({
      session,
      billingAmount: amount
    });

    // Free the slot
    session.slot_id.status = 'Available';
    await session.slot_id.save();

    // Prepare response with billing details and late alert if applicable
    const response = {
      message: 'Vehicle exited successfully.',
      billing_amount: amount,
      session_info: {
        entry_time: session.entry_time,
        exit_time: session.exit_time,
        duration_hours: billingRecord.duration_hours,
        slot_number: session.slot_id.slot_number,
        billing_type: session.billing_type
      }
    };

    // Add late alert message if vehicle was late
    if (billingRecord.is_late) {
      const entryDate = new Date(session.entry_time);
      const exitDate = new Date(session.exit_time);
      const mallClosingTime = new Date(entryDate);
      mallClosingTime.setHours(22, 0, 0, 0);
      
      const lateHours = Math.ceil((exitDate - mallClosingTime) / (1000 * 60 * 60));
      response.late_alert = {
        is_late: true,
        message: `Vehicle ${session.vehicle_id.number_plate} at slot ${session.slot_id.slot_number} is ${lateHours} hour(s) late! Mall closed at 10 PM.`,
        late_hours: lateHours
      };
    }

    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchVehicle = async (req, res) => {
  try {
    const { number_plate } = req.body;

    const vehicle = await Vehicle.findOne({ number_plate });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found.' });
    const session = await ParkingSession.findOne({ vehicle_id: vehicle._id, status: 'Active' }).populate('slot_id');
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export { vehicleEntry, vehicleExit, searchVehicle };
