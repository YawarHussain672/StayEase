import mongoose from "mongoose";

// Import models to ensure they are registered in Mongoose
import "@/models/User";
import "@/models/Property";
import "@/models/Room";
import "@/models/Booking";
import "@/models/Review";
import "@/models/Complaint";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGO_URI environment variable inside .env.local"
    );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
    // Ensure all models are registered
    const _models = mongoose.models.User || mongoose.models.Property || mongoose.models.Room || mongoose.models.Booking || mongoose.models.Review || mongoose.models.Complaint;

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
            console.log("[DEBUG] Next.js caching newly established MongoDB connection.");
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
