import redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const { REDIS_URL } = process.env;

export const redisClient = new redis(REDIS_URL);

export async function testRedisConnection() {
  try {
    const res = await redisClient.ping(); // send PING
    if (res === "PONG") {
      console.log("✅ Redis is up and responded with PONG");
    } else {
      console.warn("⚠️ Redis replied with unexpected response:", res);
    }
  } catch (err) {
    console.error("❌ Unable to connect to Redis:", err);
  }
}
