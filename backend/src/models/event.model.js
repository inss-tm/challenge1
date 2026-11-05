import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    department: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    image: { type: String },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);