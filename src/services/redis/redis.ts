import { redisClient } from "@/lib/redis";
import { RedisArgument } from "redis";


export async function setRedisCache(id: string, data: number | RedisArgument) {
    await redisClient.set(id, data, {EX: 60 * 60})
}

export async function getRedisCache(cacheKey: string){
  const value = await redisClient.get(cacheKey);
  return value;
} 