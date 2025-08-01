// src/models/Billing.js
import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
    session_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ParkingSession',
        required: true
    },
    vehicle_number: { type: String, required: true },
    vehicle_type: { type: String, required: true },
    slot_number: { type: String, required: true },
    entry_time: { type: Date, required: true },
    exit_time: { type: Date, required: true },
    billing_type: {
        type: String,
        enum: ['hourly', 'daypass'],
        required: true
    },
    total_amount: { type: Number, required: true },
    duration_hours: { type: Number, required: true },
    is_late: { type: Boolean, default: false },

}, {
    timestamps: true
});

billingSchema.index({ billing_type: 1 });
billingSchema.index({ vehicle_number: 1 });
billingSchema.index({ createdAt: 1 }); 
billingSchema.index({ exit_time: 1 });

export default mongoose.model('Billing', billingSchema);
