import {Redis } from "ioredis";
import "dotenv/config";

let redis: Redis | null = null;

export const getRedis = () => {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true
    });

    redis.once("ready", () => {
      console.log("Redis connected");
    });

    redis.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  return redis;
};
