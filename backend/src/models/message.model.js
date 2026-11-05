import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ["user", "model"], required: true },
    content: { type: String, required: true },
    inputTokens: Number,
    outputTokens: Number,
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);