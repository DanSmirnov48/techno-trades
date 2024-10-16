import mongoose from "mongoose";
import env from './config';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error: any) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB