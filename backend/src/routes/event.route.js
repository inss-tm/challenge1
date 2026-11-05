import express from "express";
const router = express.Router();
import auth from "../middlewares/auth.middleware.js";
import admin from "../middlewares/admin.middleware.js";


import { getEvents, getEventById, createEvent, registerForEvent } from "../controllers/event.controller.js";

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Admin route
router.post("/", auth, admin, createEvent);

// Member route
router.post("/:id/register", auth, registerForEvent);

export default router;