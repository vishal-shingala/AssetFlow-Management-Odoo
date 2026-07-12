# Enterprise Backend Application

A production-ready Node.js/JavaScript backend application with PostgreSQL, Redis, Winston logger, and Zod validation configured at enterprise level.

## Features

- **PostgreSQL Database**: Enterprise-grade database with connection pooling
- **Redis**: High-performance caching and session management
- **Winston Logger**: Advanced logging with daily rotation and multiple transports
- **Zod Validation**: Type-safe runtime validation with TypeScript-first schemas
- **ES Modules**: Modern JavaScript module system for better tree-shaking and performance
- **Docker Compose**: Complete containerization for local development
- **Health Checks**: Comprehensive health monitoring endpoints
- **Security**: Helmet, CORS, compression, rate limiting, and security best practices
- **Graceful Shutdown**: Proper handling of termination signals
- **JavaScript**: Modern ES2020+ with enterprise-level architecture

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm 9+
- Git

## Quick Start

### 1. Clone and Setup

```bash
# Copy environment variables
cp .env.example .env

# Install dependencies
npm install
```

### 2. Start with Docker Compose

```bash
# Start all services (PostgreSQL, Redis, and Backend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Manual Setup (Without Docker)

```bash
# Start PostgreSQL and Redis using Docker
docker-compose up postgres redis -d

# Install dependencies
npm install

# Start the application
npm start
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application Configuration
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
LOG_DIR=logs
LOG_TO_CONSOLE=true

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=backend_db
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=10000

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
REDIS_DB=0

# Security
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=10

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=*
```

## API Endpoints

### Health Checks

- `GET /health` - Overall health check (database + redis)
- `GET /health/database` - Database health check
- `GET /health/redis` - Redis health check
- `GET /ready` - Readiness probe
- `GET /live` - Liveness probe

### Response Example

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45,
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": "< 100ms"
    },
    "redis": {
      "status": "healthy",
      "responseTime": "< 50ms"
    }
  }
}
```

## Project Structure

```
backend-folder-structure/
├── src/
│   ├── app/
│   │   ├── routes.js       # Health check routes
│   │   └── server.js       # Server startup and shutdown (main entry point)
│   ├── config/
│   │   ├── database.js     # PostgreSQL configuration
│   │   ├── redis.js        # Redis configuration
│   │   └── logger.js       # Winston logger setup
│   ├── modules/            # Business logic modules
│   ├── shared/
│   │   └── validators.js   # Zod validation schemas
├── tests/                  # Test files
├── uploads/                # File uploads directory
├── logs/                   # Log files (auto-generated)
├── init-scripts/           # Database initialization scripts
├── .env.example            # Environment variables template
├── .gitignore
├── docker-compose.yml      # Docker services configuration
├── Dockerfile              # Application container image
├── package.json            # Dependencies and scripts
└── README.md
```

## Logging

The application uses Winston with the following features:

- **Daily Rotation**: Logs are rotated daily and kept for 14 days
- **Multiple Levels**: Error, warn, info, debug
- **Multiple Transports**: Console (development), File (production)
- **Structured Logging**: JSON format for easy parsing
- **Error Tracking**: Separate files for errors and exceptions

Log files are stored in the `logs/` directory:
- `application-YYYY-MM-DD.log` - All logs
- `error-YYYY-MM-DD.log` - Error logs only
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions
- `rejections-YYYY-MM-DD.log` - Unhandled promise rejections

## Database Configuration

### PostgreSQL Connection Pool

- **Max Connections**: 20 (configurable via `DB_POOL_MAX`)
- **Idle Timeout**: 30 seconds (configurable via `DB_IDLE_TIMEOUT`)
- **Connection Timeout**: 10 seconds (configurable via `DB_CONNECTION_TIMEOUT`)
- **Health Checks**: Automatic connection validation

### Usage Example

```javascript
import { query, transaction } from './config/database.js';

// Simple query
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);

// Transaction
const result = await transaction(async (client) => {
  const user = await client.query('INSERT INTO users ...');
  await client.query('INSERT INTO profiles ...');
  return user;
});
```

## Redis Configuration

### Features

- **Connection Pooling**: Automatic connection management
- **Reconnection Strategy**: Exponential backoff with max retries
- **Password Protection**: Secure authentication
- **Multiple Data Types Support**: String, Hash, List, Set, Sorted Set

### Usage Example

```javascript
import { redisSet, redisGet, redisHSet } from './config/redis.js';

// String operations
await redisSet('key', 'value', 3600); // with expiry
const value = await redisGet('key');

// Hash operations
await redisHSet('user:123', 'name', 'John');
const name = await redisHGet('user:123', 'name');
```

## Validation with Zod

The application uses Zod for type-safe runtime validation. Validation schemas are defined in `src/shared/validators.js`.

### Available Schemas

- **userSchema**: User registration and profile validation
- **loginSchema**: Login credentials validation
- **productSchema**: Product data validation
- **paginationSchema**: Query parameter validation

### Usage Example

```javascript
import { validate, userSchema } from '../shared/validators.js';

// Apply validation middleware to routes
router.post('/users', validate(userSchema), async (req, res) => {
  // req.body is now validated and typed
  const user = await createUser(req.body);
  res.status(201).json(user);
});

// Validate query parameters
router.get('/users', validateQuery(paginationSchema), async (req, res) => {
  // req.query.page, req.query.limit are validated and parsed
  const users = await getUsers(req.query);
  res.json(users);
});
```

### Validation Middleware

The application provides three validation middleware factory functions:

- `validate(schema)` - Validates request body
- `validateQuery(schema)` - Validates query parameters
- `validateParams(schema)` - Validates route parameters

All middleware return detailed error messages when validation fails.

## Docker Services

### PostgreSQL

- **Image**: postgres:15-alpine
- **Port**: 5432 (configurable)
- **Volume**: Persistent data storage
- **Health Check**: Automatic connection validation

### Redis

- **Image**: redis:7-alpine
- **Port**: 6379 (configurable)
- **Volume**: Persistent data storage
- **Persistence**: AOF (Append Only File) enabled
- **Health Check**: Automatic ping validation

### Backend Application

- **Image**: Built from Dockerfile
- **Port**: 3000 (configurable)
- **Dependencies**: Waits for healthy database and redis
- **Health Check**: HTTP endpoint validation

## Security Features

- **Helmet**: HTTP security headers with CSP and HSTS
- **CORS**: Cross-origin resource sharing configuration
- **Compression**: Gzip compression for better performance
- **Rate Limiting**: Protection against DDoS attacks with skip for health checks
- **Input Validation**: Zod schemas for type-safe runtime validation
- **Environment Variables**: Sensitive data protection
- **Non-root User**: Container runs as non-root user

## Graceful Shutdown

The application handles shutdown gracefully:

1. **SIGTERM/SIGINT**: Catches termination signals
2. **Connection Cleanup**: Closes database and redis connections
3. **Request Completion**: Allows in-flight requests to complete
4. **Force Shutdown**: 10-second timeout for forced termination

## Monitoring

### Health Check Endpoints

Use these endpoints for monitoring:

```bash
# Overall health
curl http://localhost:3000/health

# Database health
curl http://localhost:3000/health/database

# Redis health
curl http://localhost:3000/health/redis

# Readiness (Kubernetes)
curl http://localhost:3000/ready

# Liveness (Kubernetes)
curl http://localhost:3000/live
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test database connection
docker-compose exec postgres psql -U postgres -d backend_db
```

### Redis Connection Issues

```bash
# Check Redis logs
docker-compose logs redis

# Test Redis connection
docker-compose exec redis redis-cli -a redis_password ping
```

### Application Won't Start

```bash
# Check application logs
docker-compose logs backend

# Verify environment variables
docker-compose config

# Rebuild containers
docker-compose up -d --build
```

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong passwords for database and redis
3. Configure proper CORS origins
4. Set appropriate log levels
5. Enable SSL/TLS for production

### Docker Compose Production

```bash
# Build and start with production configuration
docker-compose -f docker-compose.yml up -d --build
```

### Manual Production Deployment

```bash
# Start with PM2 (recommended)
pm2 start src/app/server.js --name backend-app

# Or start directly
NODE_ENV=production npm start
```

## License

MIT

## Support

For issues and questions, please refer to the project documentation or contact the development team.
