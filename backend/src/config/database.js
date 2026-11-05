import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = (process.env.MONGODB_URI || "").trim();
    const connectionInstance = await mongoose.connect(uri);
    console.log(`\n MongoDB connected\n        ${connectionInstance.connection.host}`);
    return connectionInstance;
  } catch (error) {
    console.log("mongoDB connection failed", error);
    throw error;
  }
};

export default connectDB;
