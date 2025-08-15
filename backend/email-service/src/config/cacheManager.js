import NodeCache from "node-cache";
import { redis } from "../server.js";

// Fallback to in-memory cache if Redis is not available
const memoryCache = new NodeCache({ stdTTL: 600 });

// Cache wrapper to handle both Redis and memory cache
class CacheManager {
  constructor() {
    this.useRedis = false;
    this.initRedis();
  }

  async initRedis() {
    try {
      await redis.connect();
      this.useRedis = true;
      console.log("✅ Connected to Redis cache");
    } catch (error) {
      console.log("❌ Redis not available, using in-memory cache");
    }
  }

  async set(key, value, ttl = 600) {
    try {
      if (this.useRedis) {
        await redis.setEx(key, ttl, JSON.stringify(value));
      } else {
        memoryCache.set(key, value, ttl);
      }
    } catch (error) {
      console.error("Cache set error:", error);
    }
  }

  async get(key) {
    try {
      if (this.useRedis) {
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        return memoryCache.get(key) || null;
      }
    } catch (error) {
      console.error("Cache get error:", error);
      return null;
    }
  }

  async del(key) {
    try {
      if (this.useRedis) {
        await redis.del(key);
      } else {
        memoryCache.del(key);
      }
    } catch (error) {
      console.error("Cache delete error:", error);
    }
  }
}

export default CacheManager;
