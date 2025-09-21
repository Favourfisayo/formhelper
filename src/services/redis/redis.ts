import { ensureRedisConnection, redisClient } from "@/lib/redis";

export async function setRedisCache(
  key: string, 
  value: any,
  ttlSeconds = 3600
) {
  try {
    await ensureRedisConnection()
    let storeValue: string;
    if (typeof value === "string") {
      storeValue = value;
    } else if (typeof value === "number") {
      storeValue = value.toString(); 
    } else {
      storeValue = JSON.stringify(value);
    }

    await redisClient.set(key, storeValue, { expiration: {type: "EX", value: ttlSeconds} });
  } catch (err) {
    return null
  }
}


export async function getRedisCache<T = any>(key: string): Promise<T | null> {
  try {
    await ensureRedisConnection()
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    return null;
  }
}

export async function setRedisBinaryCache(
  key: string,
  value: string, 
  ttlSeconds = 3600
) {
  try {
    await ensureRedisConnection()
    await redisClient.set(key, value, { expiration: {type: "EX", value: ttlSeconds} });
  } catch (err) {
    return null
  }
}

export async function getRedisBinaryCache(key: string): Promise<string | null> {
  try {
    await ensureRedisConnection()
    return await redisClient.get(key);
  } catch (err) {
    return null;
  }
}