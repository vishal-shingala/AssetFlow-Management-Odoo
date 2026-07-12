import { createClient } from 'redis';
import logger from './logger.js';

// Redis configuration
const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        logger.error('Redis reconnection attempts exhausted', { retries });
        return new Error('Redis reconnection failed');
      }
      const delay = Math.min(retries * 100, 3000);
      logger.info('Redis reconnecting...', { attempt: retries, delay });
      return delay;
    },
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0', 10),
};

// Create Redis client
const client = createClient(redisConfig);

// Client event listeners
client.on('connect', () => {
  logger.info('Redis client connected');
});

client.on('ready', () => {
  logger.info('Redis client ready to accept commands');
});

client.on('error', (err) => {
  logger.error('Redis client error', { error: err.message });
});

client.on('end', () => {
  logger.warn('Redis client connection ended');
});

client.on('reconnecting', () => {
  logger.info('Redis client reconnecting');
});

// Initialize Redis connection
const initializeRedis = async () => {
  try {
    await client.connect();
    logger.info('Redis connection established successfully', {
      host: redisConfig.socket.host,
      port: redisConfig.socket.port,
      database: redisConfig.database,
    });
    
    // Test connection
    await client.ping();
    logger.info('Redis ping successful');
  } catch (error) {
    logger.error('Failed to initialize Redis connection', { error });
    throw error;
  }
};

// Get Redis client instance
const getRedisClient = () => {
  return client;
};

// Common Redis operations with error handling
const redisSet = async (key, value, expiry) => {
  try {
    if (expiry) {
      await client.setEx(key, expiry, value);
    } else {
      await client.set(key, value);
    }
    logger.debug('Redis SET successful', { key, expiry });
    return true;
  } catch (error) {
    logger.error('Redis SET failed', { key, error });
    throw error;
  }
};

const redisGet = async (key) => {
  try {
    const value = await client.get(key);
    logger.debug('Redis GET successful', { key, found: !!value });
    return value;
  } catch (error) {
    logger.error('Redis GET failed', { key, error });
    throw error;
  }
};

const redisDel = async (key) => {
  try {
    await client.del(key);
    logger.debug('Redis DEL successful', { key });
    return true;
  } catch (error) {
    logger.error('Redis DEL failed', { key, error });
    throw error;
  }
};

const redisExpire = async (key, seconds) => {
  try {
    await client.expire(key, seconds);
    logger.debug('Redis EXPIRE successful', { key, seconds });
    return true;
  } catch (error) {
    logger.error('Redis EXPIRE failed', { key, seconds, error });
    throw error;
  }
};

const redisExists = async (key) => {
  try {
    const exists = await client.exists(key);
    logger.debug('Redis EXISTS successful', { key, exists: !!exists });
    return exists === 1;
  } catch (error) {
    logger.error('Redis EXISTS failed', { key, error });
    throw error;
  }
};

// Hash operations
const redisHSet = async (key, field, value) => {
  try {
    await client.hSet(key, field, value);
    logger.debug('Redis HSET successful', { key, field });
    return true;
  } catch (error) {
    logger.error('Redis HSET failed', { key, field, error });
    throw error;
  }
};

const redisHGet = async (key, field) => {
  try {
    const value = await client.hGet(key, field);
    logger.debug('Redis HGET successful', { key, field, found: !!value });
    return value;
  } catch (error) {
    logger.error('Redis HGET failed', { key, field, error });
    throw error;
  }
};

const redisHGetAll = async (key) => {
  try {
    const value = await client.hGetAll(key);
    logger.debug('Redis HGETALL successful', { key, fields: Object.keys(value).length });
    return value;
  } catch (error) {
    logger.error('Redis HGETALL failed', { key, error });
    throw error;
  }
};

const redisHDel = async (key, field) => {
  try {
    await client.hDel(key, field);
    logger.debug('Redis HDEL successful', { key, field });
    return true;
  } catch (error) {
    logger.error('Redis HDEL failed', { key, field, error });
    throw error;
  }
};

// List operations
const redisLPush = async (key, ...values) => {
  try {
    const length = await client.lPush(key, values);
    logger.debug('Redis LPUSH successful', { key, length });
    return length;
  } catch (error) {
    logger.error('Redis LPUSH failed', { key, error });
    throw error;
  }
};

const redisRPop = async (key) => {
  try {
    const value = await client.rPop(key);
    logger.debug('Redis RPOP successful', { key, found: !!value });
    return value;
  } catch (error) {
    logger.error('Redis RPOP failed', { key, error });
    throw error;
  }
};

// Set operations
const redisSAdd = async (key, ...members) => {
  try {
    const count = await client.sAdd(key, members);
    logger.debug('Redis SADD successful', { key, count });
    return count;
  } catch (error) {
    logger.error('Redis SADD failed', { key, error });
    throw error;
  }
};

const redisSMembers = async (key) => {
  try {
    const members = await client.sMembers(key);
    logger.debug('Redis SMEMBERS successful', { key, count: members.length });
    return members;
  } catch (error) {
    logger.error('Redis SMEMBERS failed', { key, error });
    throw error;
  }
};

// Health check for Redis
const healthCheck = async () => {
  try {
    const result = await client.ping();
    return result === 'PONG';
  } catch (error) {
    logger.error('Redis health check failed', { error });
    return false;
  }
};

// Graceful shutdown
const closeRedis = async () => {
  try {
    await client.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection', { error });
    throw error;
  }
};

export {
  client,
  initializeRedis,
  getRedisClient,
  redisSet,
  redisGet,
  redisDel,
  redisExpire,
  redisExists,
  redisHSet,
  redisHGet,
  redisHGetAll,
  redisHDel,
  redisLPush,
  redisRPop,
  redisSAdd,
  redisSMembers,
  healthCheck,
  closeRedis,
};
