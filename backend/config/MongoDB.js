import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        mongoose.connection.on('connected',()=>{
            console.log("MongoDB connected");
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/bookingapp`); 

    } catch (error) {
        console.log(error);
    }
}
export default connectDB