import { createClient } from 'redis';
export const redisClient = createClient({
    username: 'default',
    password: 'hINEa99G7XALPqau9155aL2vrgC3Bb7V',
    socket: {
        host: 'redis-19854.c99.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 19854
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Connected to Redis");
    }
}