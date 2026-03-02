import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const {MONGO_URI} = process.env
        if (!MONGO_URI) throw new Error("MONGO_URI is not set")

        const conn = await mongoose.connect(MONGO_URI)
        console.log("MONGODB connected successfully", conn.connection.host)
    } catch (error) {
        console.error("Failed to connect to database", error)
        process.exit(1)
    }
}