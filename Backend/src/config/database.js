import { Pool } from "pg";
import logger from "./logger.js";

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "backend_db",
  max: parseInt(process.env.DB_POOL_MAX || "20", 10), // Maximum pool size
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000", 10), // Close idle clients after 30 seconds
  connectionTimeoutMillis: parseInt(
    process.env.DB_CONNECTION_TIMEOUT || "10000",
    10,
  ), // Return an error after 10 seconds if connection could not be established
};

// Create connection pool
const pool = new Pool(dbConfig);

// Pool event listeners
pool.on("connect", () => {
  logger.info("New client connected to PostgreSQL");
});

pool.on("error", (err) => {
  logger.error("Unexpected error on idle PostgreSQL client", {
    error: err.message,
  });
});

pool.on("remove", () => {
  logger.warn("PostgreSQL client removed from pool");
});

// Initialize database connection
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    logger.info("Database connection established successfully", {
      timestamp: result.rows[0].now,
      host: dbConfig.host,
      database: dbConfig.database,
    });
    client.release();
  } catch (error) {
    logger.error("Failed to initialize database connection", { error });
    throw error;
  }
};

// Execute query with automatic connection management
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    logger.error("Query execution failed", { text, params, error });
    throw error;
  }
};

// Get a client from the pool for transactions
const getClient = async () => {
  const client = await pool.connect();
  const queryFn = client.query.bind(client);
  const release = client.release.bind(client);

  // Set a timeout for the client if it's checked out for too long
  const timeout = setTimeout(() => {
    logger.error("A client has been checked out for too long", {
      duration: dbConfig.connectionTimeoutMillis,
    });
  }, dbConfig.connectionTimeoutMillis);

  client.release = () => {
    clearTimeout(timeout);
    client.release = release;
    return release();
  };

  return { client, query: queryFn, release };
};

// Execute a transaction
const transaction = async (callback) => {
  const { client, release } = await getClient();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Transaction failed, rolled back", { error });
    throw error;
  } finally {
    release();
  }
};

// Health check for database
const healthCheck = async () => {
  try {
    const result = await pool.query("SELECT 1");
    return result.rowCount === 1;
  } catch (error) {
    logger.error("Database health check failed", { error });
    return false;
  }
};

// Graceful shutdown
const closeDatabase = async () => {
  try {
    await pool.end();
    logger.info("Database connection pool closed");
  } catch (error) {
    logger.error("Error closing database connection pool", { error });
    throw error;
  }
};

export {
  pool,
  initializeDatabase,
  query,
  getClient,
  transaction,
  healthCheck,
  closeDatabase,
};
