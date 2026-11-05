import { Router } from "express";
import { chat, chatStream, getHistory } from "../controllers/chatbot.controller.js";
import rateLimit from "express-rate-limit";

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 messages per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages, please wait a minute." },
});

router.post("/stream", chatLimiter, chatStream);
router.post("/", chatLimiter, chat);
router.get("/history", getHistory);
router.get("/history/:sessionId", getHistory);
router.post("/history", getHistory);

export default router;
