const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // 👈 REQUIRED for BullMQ
  enableReadyCheck: false, // 👈 RECOMMENDED to prevent connection issues
});

redis.on("connect", () => console.log("🔗 Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error: ", err));

module.exports = redis;
