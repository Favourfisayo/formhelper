import { ensureRedisConnection, redisClient } from "@/lib/redis";

export async function setRedisCache<T = unknown>(
  key: string,
  value: T,
  ttlSeconds = 3600
): Promise<void> {
  try {
    await ensureRedisConnection();
    let storeValue: string;
    if (typeof value === "string") {
      storeValue = value;
    } else if (typeof value === "number") {
      storeValue = value.toString();
    } else {
      storeValue = JSON.stringify(value);
    }

    await redisClient.set(key, storeValue, { expiration: { type: "EX", value: ttlSeconds } });
  } catch (err) {
    throw new Error(`Error updating cache: ${err}`);
  }
}



export async function getRedisCache<T = string>(key: string): Promise<T | null> {
  try {
    await ensureRedisConnection();
    const value = await redisClient.get(key);

    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (err) {
    throw new Error(`Error getting cached data: ${err}`);
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
    throw new Error(`Error setting cache: ${err}`)
  }
}

export async function getRedisBinaryCache(key: string): Promise<string | null> {
  try {
    await ensureRedisConnection()
    return await redisClient.get(key);
  } catch (err) {
    throw new Error(`Error getting cached data: ${err}`)
  }
}