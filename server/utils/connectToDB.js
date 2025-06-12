import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI;

const connection = {
    isConnected: false,
};

async function connectToDB() {
    if (connection.isConnected) return;

    try {
        await mongoose.connect(MONGO_URI);
        connection.isConnected = true;
        console.log("🟢 Connected to DB successfully");
    } catch (err) {
        console.error("🔴 DB Connection Error:", err.message);
    }
}

export default connectToDB;
