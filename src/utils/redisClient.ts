import { createClient } from 'redis';

const redisClient = await createClient({ url: process.env.REDIS_URL })
  .on('connect', () => console.log('Connecting to Redis.'))
  .on('ready', () => console.log('Redis connected.'))
  .on('end', () => console.log('Redis disconnected.'))
  .on('error', (error: Error) => console.error(error))
  .on('reconnecting', () => console.log('Reconnecting to Redis.'))
  .connect();

export default redisClient;