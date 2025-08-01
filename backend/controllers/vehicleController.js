import Vehicle from "../models/Vehicle.js";
import ParkingSession from "../models/ParkingSession.js";
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

      if (slot.status !== 'Available') {
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

    const session = await ParkingSession.findOne({ vehicle_id: vehicle._id, status: 'Active' }).populate('slot_id');
    if (!session) return res.status(404).json({ error: 'No active session found for this vehicle.' });

    session.exit_time = new Date();
    session.status = 'Completed';

    let amount = 0;

    if (session.billing_type === 'hourly') {
      // Calculate duration in hours (rounded up)
      const durationMs = session.exit_time - session.entry_time;
      const hours = Math.ceil(durationMs / (1000 * 60 * 60));

      // Apply slab-based pricing
      if (hours <= 1) {
        amount = 50;        // 0-1 hour → ₹50
      } else if (hours <= 3) {
        amount = 100;       // 1-3 hours → ₹100
      } else if (hours <= 6) {
        amount = 150;       // 3-6 hours → ₹150
      } else {
        amount = 200;       // 6+ hours → ₹200 (daily cap)
      }
    } else if (session.billing_type === 'daypass') {
      amount = 150;         // Day pass flat rate
    }

    session.billing_amount = amount;
    await session.save();

    session.slot_id.status = 'Available';
    await session.slot_id.save();

    res.json({
      message: 'Vehicle exited successfully.',
      billing_amount: amount
    });
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
