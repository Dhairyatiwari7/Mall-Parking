import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/MongoDB.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import parkingSlotRoutes from './routes/parkingSlotRoutes.js';
import parkingSessionRoutes from './routes/parkingSessionRoutes.js';
import billingRoutes from './routes/billingRoutes.js'

const app=express();
const PORT=process.env.PORT

app.use(cors());
app.use(express.json());

await connectDB();

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/slots', parkingSlotRoutes);
app.use('/api/sessions', parkingSessionRoutes);
app.use('/api/billing',billingRoutes)

app.listen(process.env.PORT,()=>console.log(`Server running on port ${PORT}`));