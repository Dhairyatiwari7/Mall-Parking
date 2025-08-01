import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  number_plate: { type: String, required: true, unique: false },
  type: { type: String, enum: ['Car', 'Bike', 'EV', 'Handicap Accessible'], required: true }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle