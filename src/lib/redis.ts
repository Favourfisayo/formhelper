import { createClient } from 'redis';
let isConnecting = false;

export async function ensureRedisConnection() {
  if (redisClient.isOpen) return;
  
  if (isConnecting) {
    while (isConnecting && !redisClient.isOpen) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return;
  }
  
  isConnecting = true;
  try {
    await redisClient.connect();
  } catch (error) {
    throw new Error(`Error connecting to redis: ${error}`)
  } finally {
    isConnecting = false;
  }
}

export const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT)
    }
});