import mongoose from "mongoose";

const parkingSlotSchema = new mongoose.Schema({
  slot_number: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Regular', 'Compact', 'Bike', 'EV', 'Handicap Accessible'], required: true },
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  location: { type: String }, 
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
export default ParkingSlot