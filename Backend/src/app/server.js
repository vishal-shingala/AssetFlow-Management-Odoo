import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import routes from './routes.js';
import departmentRoutes from '../modules/departments/routes/departmentRoutes.js';
import categoryRoutes from '../modules/categories/routes/categoryRoutes.js';
import userRoutes from '../modules/users/routes/userRoutes.js';
import logger from '../config/logger.js';
import { initializeDatabase, closeDatabase } from '../config/database.js';
import { initializeRedis, closeRedis } from '../config/redis.js';

let server;

// Initialize services
const initializeServices = async () => {
  try {
    await initializeDatabase();
    await initializeRedis();
    logger.info("All services initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize services", { error });
    throw error;
  }
};

// Shutdown services
const shutdownServices = async () => {
  try {
    await closeDatabase();
    await closeRedis();
    logger.info("All services shut down successfully");
  } catch (error) {
    logger.error("Error during service shutdown", { error });
    throw error;
  }
};

// Create Express app with middleware
const createApp = () => {
  const app = express();

  // Security middleware - Helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  // CORS middleware
  const corsOrigin = process.env.CORS_ORIGIN || "*";
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
  );

  // Compression middleware
  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }
        return compression.filter(req, res);
      },
      threshold: 1024,
      level: 6,
    }),
  );

  // Body parsing middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Rate limiting middleware
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    message: {
      error: "Too many requests",
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for health checks
      return (
        req.path === "/health" || req.path === "/ready" || req.path === "/live"
      );
    },
  });
  app.use("/api/", limiter);

  // Request logging middleware
  app.use((req, res, next) => {
    logger.info("Incoming request", {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
    next();
  });

  // Health check routes
  app.use("/", routes);

  // API routes
  app.use('/api/departments', departmentRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/users', userRoutes);

  // 404 handler
  app.use((req, res) => {
    logger.warn("Route not found", { method: req.method, url: req.url });
    res.status(404).json({
      error: "Not Found",
      message: `Route ${req.method} ${req.url} not found`,
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    const statusCode = err.status || err.statusCode || 500;
    
    logger.error("Unhandled error", {
      error: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      status: statusCode,
      errorName: err.name,
    });

    res.status(statusCode).json({
      error: err.name || "Internal Server Error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "An unexpected error occurred",
    });
  });

  return app;
};

// Start server
const startServer = async (port = 3000) => {
  try {
    // Initialize services (database, redis)
    await initializeServices();

    // Create Express app with middleware
    const app = createApp();

    // Start server
    server = app.listen(port, () => {
      logger.info("Server started successfully", {
        port,
        env: process.env.NODE_ENV || "development",
        nodeVersion: process.version,
        platform: process.platform,
      });
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

      switch (error.code) {
        case "EACCES":
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case "EADDRINUSE":
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info("HTTP server closed");

        try {
          await shutdownServices();
          logger.info("Graceful shutdown completed");
          process.exit(0);
        } catch (error) {
          logger.error("Error during graceful shutdown", { error });
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    // Handle termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception", {
        error: error.message,
        stack: error.stack,
      });
      gracefulShutdown("uncaughtException");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection", { reason, promise });
      gracefulShutdown("unhandledRejection");
    });

    return server;
  } catch (error) {
    logger.error("Failed to start server", { error });
    process.exit(1);
  }
};

// Start the server if this file is run directly
const PORT = parseInt(process.env.PORT || "3000", 10);
startServer(PORT)
  .then(() => {
    logger.info("Application started successfully");
  })
  .catch((error) => {
    logger.error("Failed to start application", { error });
    process.exit(1);
  });

export { startServer, createApp, initializeServices, shutdownServices };
