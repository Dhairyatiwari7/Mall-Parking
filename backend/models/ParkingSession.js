import mongoose from "mongoose";

const parkingSessionSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  slot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
  entry_time: { type: Date, default: Date.now },
  exit_time: { type: Date },
  status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
  billing_type: { type: String, enum: ['hourly', 'daypass'], required: true },
  billing_amount: { type: Number }
});

const ParkingSession = mongoose.model('ParkingSession', parkingSessionSchema);
export default ParkingSession
