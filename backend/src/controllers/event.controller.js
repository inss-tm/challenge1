import { Event } from "../models/event.model.js";
import redis from "../config/redis.js";

// 1. GET ALL EVENTS (cached)
const getEvents = async (req, res) => {
  try {
    const cached = await redis.get("events:all");
    if (cached) {
      res.set("Cache-Control", "public, max-age=60");
      res.set("X-Cache", "HIT");
      return res.status(200).json({
        success: true,
        events: JSON.parse(cached),
      });
    }

    const events = await Event.find().lean();
    await redis.set("events:all", JSON.stringify(events), { EX: 300 });

    res.set("X-Cache", "MISS");
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 2. GET ONE EVENT (cached)
const getEventById = async (req, res) => {
  try {
    const key = `event:${req.params.id}`;

    const cached = await redis.get(key);
    if (cached) {
      res.set("Cache-Control", "public, max-age=60");
      res.set("X-Cache", "HIT");
      return res.status(200).json({
        success: true,
        event: JSON.parse(cached),
      });
    }

    const event = await Event.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    await redis.set(key, JSON.stringify(event), { EX: 300 });

    res.set("X-Cache", "MISS");
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 3. CREATE EVENT (admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, department, capacity, image } =
      req.body;

    if (!title || !description || !date || !location || !department || !capacity) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      department,
      capacity,
      image,
    });

    // clear the list cache so the new event shows up
    await redis.del("events:all");

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 4. REGISTER FOR EVENT (member)
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    const userId = req.user.userId;

    const taken = await Registration.countDocuments({ event: event._id });
    if (taken >= event.capacity) {
      return res.status(409).json({
        success: false,
        error: "Event is full",
      });
    }

    // the unique (user, event) index rejects duplicates
    await Registration.create({ user: userId, event: event._id });

    res.status(200).json({
      success: true,
      message: "Successfully registered for event",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Already registered",
      });
    }
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 5. UNREGISTER FROM EVENT (member)
const unregisterFromEvent = async (req, res) => {
  try {
    const deleted = await Registration.findOneAndDelete({
      user: req.user.userId,
      event: req.params.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Unregistered successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 6. MY EVENTS (member)
const getMyEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.userId })
      .populate("event")
      .sort({ createdAt: -1 })
      .lean();

    const events = registrations.map((r) => r.event).filter(Boolean);

    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyEvents,
};