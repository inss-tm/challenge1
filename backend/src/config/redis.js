import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    connectTimeout: 3000,
  },
});
redis.on("error", (err) => console.log("Redis error:", err.message));

export const connectRedis = async () => {
  try {
    await redis.connect();
    console.log("Redis connected");
  } catch (err) {
    console.log("Redis connection notice:", err.message);
  }
};

export default redis;
