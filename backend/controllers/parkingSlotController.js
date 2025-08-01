import ParkingSlot from "../models/ParkingSlot.js";
import ParkingSession from "../models/ParkingSession.js";
import Vehicle from '../models/Vehicle.js'
const setSlotMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await ParkingSlot.findByIdAndUpdate(id, { status: 'Maintenance' }, { new: true });
    if (!slot) return res.status(404).json({ error: 'Slot not found.' });
    res.json({ message: 'Slot set to maintenance.', slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const setSlotAvailable = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await ParkingSlot.findByIdAndUpdate(id, { status: 'Available' }, { new: true });
    if (!slot) return res.status(404).json({ error: 'Slot not found.' });
    res.json({ message: 'Slot marked available.', slot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSlots = async (req, res) => {
  try {
    const { type } = req.body; 
    const filter = {};
    if (type) filter.type = type;

    const slots = await ParkingSlot.find(filter);
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const { type } = req.body; 
    
    const filter = {};
    if (type) filter.type = type;
    
    const slots = await ParkingSlot.find(filter);
    
    const totalSlots = slots.length;
    const availableSlots = slots.filter(slot => slot.status === 'Available').length;
    const occupiedSlots = slots.filter(slot => slot.status === 'Occupied').length;
    const maintenanceSlots = slots.filter(slot => slot.status === 'Maintenance').length;
    
    const activeSessions = await ParkingSession.find({ status: 'Active' })
      .populate('vehicle_id')
      .populate('slot_id');
    
    const allVehicles = await Vehicle.find({});
    
    const vehiclesByType = allVehicles.reduce((acc, vehicle) => {
      if (!acc[vehicle.type]) {
        acc[vehicle.type] = 0;
      }
      acc[vehicle.type]++;
      return acc;
    }, {});
    
    const slotsByType = slots.reduce((acc, slot) => {
      if (!acc[slot.type]) {
        acc[slot.type] = { total: 0, available: 0, occupied: 0, maintenance: 0 };
      }
      acc[slot.type].total++;
      acc[slot.type][slot.status.toLowerCase()]++;
      return acc;
    }, {});
    
    const recentSessions = await ParkingSession.find({ status: 'Completed' })
      .populate('vehicle_id')
      .populate('slot_id')
      .sort({ exit_time: -1 })
      .limit(10);
    
    return res.status(200).json({
      overview: {
        totalSlots,
        availableSlots,
        occupiedSlots,
        maintenanceSlots,
        activeSessions: activeSessions.length,
        totalVehicles: allVehicles.length
      },
      slotsByType,
      vehiclesByType,
      slots,
      vehicles: allVehicles,
      activeSessionsDetails: activeSessions,
      recentSessions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { setSlotMaintenance, setSlotAvailable, getSlots,getDashboardStats };
