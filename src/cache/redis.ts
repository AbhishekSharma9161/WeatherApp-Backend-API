import Redis from "ioredis";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

let client: Redis | null = null;
let redisAvailable = false;

// Try to connect to Redis if REDIS_URL is provided
const redisUrl = process.env.REDIS_URL;
console.log('🔍 Debug - REDIS_URL:', redisUrl);
const shouldUseRedis = redisUrl;

if (shouldUseRedis) {
  try {
    client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });

    client.on('connect', () => {
      console.log('✅ Connected to Redis - caching enabled');
      redisAvailable = true;
    });

    client.on('error', (err: Error) => {
      console.log('❌ Redis connection failed - running without cache');
      redisAvailable = false;
      client = null;
    });
  } catch (err) {
    console.log('❌ Redis initialization failed - running without cache');
    redisAvailable = false;
    client = null;
  }
} else {
  console.log('ℹ️  Redis not configured - running without cache (set REDIS_URL to enable)');
}


const getWeatherData = async (key: string): Promise<string | null> => {
  if (!client || !redisAvailable) {
    return null;
  }
  
  try {
    const data = await client.get(key);
    return data;
  } catch (err) {
    redisAvailable = false;
    client = null;
    return null;
  }
};

const setWeatherData = async (key: string, value: string, expiryInSeconds: number): Promise<void> => {
  if (!client || !redisAvailable) {
    return;
  }
  
  try {
    await client.set(key, value, 'EX', expiryInSeconds);
  } catch (err) {
    redisAvailable = false;
    client = null;
  }
};


export {getWeatherData,setWeatherData}