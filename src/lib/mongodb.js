import mongoose from "mongoose";

const connectMongo = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return
        await mongoose.connect(process.env.MONGODB_URI)

        console.log('MongoDB connected')
    } catch (error) {
        console.error('Failed to connect MongoDB', error)
        throw error
    }
}
export default connectMongo