import mongoose from "mongoose";

// Connect to MongoDB. Fails fast (10s) instead of hanging, logs a clear
// error, and retries in the background — so a DB outage no longer crashes
// the whole server (the health check and API stay reachable, and the app
// reconnects on its own once the database is back).
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("DB Connected");
    } catch (err) {
        console.error("DB connection failed, retrying in 5s:", err.message);
        setTimeout(connectDB, 5000);
    }
}


// add your mongoDB connection string above.
// Do not use '@' symbol in your databse user's password else it will show an error.