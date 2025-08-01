import ParkingSession from "../models/ParkingSession.js";

const getActiveSessions = async (req, res) => {
  try {
    const sessions = await ParkingSession.find({ status: 'Active' })
      .populate('vehicle_id')
      .populate('slot_id')
      .sort({ entry_time: -1 }); 
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getActiveSessions };
