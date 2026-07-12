import express from 'express';
import { healthCheck as dbHealthCheck } from '../config/database.js';
import { healthCheck as redisHealthCheck } from '../config/redis.js';
import logger from '../config/logger.js';

const router = express.Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const dbHealthy = await dbHealthCheck();
    const redisHealthy = await redisHealthCheck();

    const healthStatus = {
      status: dbHealthy && redisHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: {
          status: dbHealthy ? 'healthy' : 'unhealthy',
          responseTime: dbHealthy ? '< 100ms' : 'timeout',
        },
        redis: {
          status: redisHealthy ? 'healthy' : 'unhealthy',
          responseTime: redisHealthy ? '< 50ms' : 'timeout',
        },
      },
    };

    const statusCode = dbHealthy && redisHealthy ? 200 : 503;
    
    logger.info('Health check performed', healthStatus);
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// Database health check endpoint
router.get('/health/database', async (req, res) => {
  try {
    const isHealthy = await dbHealthCheck();
    
    const response = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };

    const statusCode = isHealthy ? 200 : 503;
    
    logger.info('Database health check performed', response);
    
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Database health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database health check failed',
    });
  }
});

// Redis health check endpoint
router.get('/health/redis', async (req, res) => {
  try {
    const isHealthy = await redisHealthCheck();
    
    const response = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };

    const statusCode = isHealthy ? 200 : 503;
    
    logger.info('Redis health check performed', response);
    
    res.status(statusCode).json(response);
  } catch (error) {
    logger.error('Redis health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Redis health check failed',
    });
  }
});

// Readiness probe endpoint
router.get('/ready', async (req, res) => {
  try {
    const dbHealthy = await dbHealthCheck();
    const redisHealthy = await redisHealthCheck();

    if (dbHealthy && redisHealthy) {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: 'not ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: dbHealthy ? 'ready' : 'not ready',
          redis: redisHealthy ? 'ready' : 'not ready',
        },
      });
    }
  } catch (error) {
    logger.error('Readiness check failed', { error });
    res.status(503).json({
      status: 'not ready',
      timestamp: new Date().toISOString(),
      error: 'Readiness check failed',
    });
  }
});

// Liveness probe endpoint
router.get('/live', (req, res) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
