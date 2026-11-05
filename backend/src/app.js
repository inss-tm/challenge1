import express from "express";
const app = express();

import cors from 'cors';

app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  credentials: true
}));

// import routers 
import userRouter from "./routes/user.route.js"
import healthRouter from "./routes/health.route.js"
import requestLogger from "./middlewares/requestLogger.js";
import eventRouter from "./routes/event.route.js"
import chatRouter from "./routes/chatbot.route.js";

app.use(express.json());

// routes declaration 
app.use("/api/auth", userRouter);
app.use("/api/health", healthRouter);
app.use("/api/events", eventRouter);
app.use("/api/chat", chatRouter);
app.use(requestLogger);

export default app;
