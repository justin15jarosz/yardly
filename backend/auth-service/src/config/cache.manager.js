import { createClient } from "redis";
import BaseException from "../../../user-service/src/middlewares/exceptions/base.exception";

// Shared cache configuration
export const redis = createClient({
  url: process.env.REDIS_URL,
});

export async function initRedis() {
  try {
    await redis.connect();
    console.log("✅ Connected to Redis cache");
  } catch (error) {
    console.log("❌ Redis not available");
    throw new BaseException("Redis connection error", 500);
  }
}

async function set(key, value, ttl = 600) {
  try {
      await redis.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("Cache set error:", error);
  }
}

async function get(key) {
  try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Cache get error:", error);
    return null;
  }
}

async function del(key) {
  try {
      await redis.del(key);
  } catch (error) {
    console.error("Cache delete error:", error);
  }
}

export const cacheManager = {
  set,
  get,
  del,
};