# Database Setup Guide for AssetFlow

## How Docker Automatically Initializes PostgreSQL

Your `docker-compose.yml` is already configured to automatically run database initialization scripts:

```yaml
postgres:
  volumes:
    - ./init-scripts:/docker-entrypoint-initdb.d
```

**How it works:**
- PostgreSQL's official Docker image automatically executes any `.sql` files in the `/docker-entrypoint-initdb.d` directory
- This happens **only on first container start** (when the database is empty)
- The `01-init-schema.sql` file in `init-scripts/` will be executed automatically
- All tables, indexes, and triggers will be created without manual intervention

## Team Setup Instructions

### Prerequisites
- Docker Desktop installed
- Git access to the repository
- `.env` file configured (copy from `.env.example`)

### Quick Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred values (or use defaults)
   ```

3. **Start the database**
   ```bash
   docker-compose up -d postgres
   ```

4. **Verify database initialization**
   ```bash
   # Check logs to see schema creation
   docker-compose logs postgres
   ```

5. **Start the full application**
   ```bash
   docker-compose up -d
   ```

### What Happens Automatically

When you run `docker-compose up -d postgres` for the first time:
1. PostgreSQL container starts
2. It detects files in `./init-scripts/`
3. Executes `01-init-schema.sql` automatically
4. Creates all 11 tables with proper relationships
5. Creates all performance indexes
6. Sets up the `updated_at` trigger for the assets table
7. Database is ready for use

### Database Connection Details

After setup, connect using these credentials (from `.env`):
- **Host:** `localhost` (or `postgres` within Docker network)
- **Port:** `5432` (or your `DB_PORT` from .env)
- **Database:** `backend_db` (or your `DB_NAME` from .env)
- **User:** `postgres` (or your `DB_USER` from .env)
- **Password:** `postgres` (or your `DB_PASSWORD` from .env)

### Resetting the Database

If you need to reset the database (drop all tables and reinitialize):

```bash
# Stop and remove containers
docker-compose down

# Remove the PostgreSQL volume (deletes all data)
docker volume rm assetflow-management-odoo_postgres_data

# Start fresh (will re-run init scripts)
docker-compose up -d postgres
```

### Adding New Database Changes

When you need to modify the schema:

1. **Create a new migration script** in `init-scripts/`:
   - Name it with a prefix: `02-add-new-table.sql`, `03-alter-assets.sql`, etc.
   - PostgreSQL executes scripts in alphabetical order

2. **For existing databases** (already initialized):
   - Scripts in `init-scripts/` won't run again
   - Manually apply changes: `docker exec -i postgres psql -U postgres -d backend_db < init-scripts/02-add-new-table.sql`
   - Or use a migration tool like Knex.js, Prisma, or Flyway

3. **For fresh setups**:
   - New teammates will get all changes automatically
   - Just add the script to `init-scripts/`

### Troubleshooting

**Schema not created:**
```bash
# Check if init-scripts directory exists
ls init-scripts/

# Check PostgreSQL logs
docker-compose logs postgres

# Manually run the script
docker exec -i postgres psql -U postgres -d backend_db < init-scripts/01-init-schema.sql
```

**Connection refused:**
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check port mapping in `.env` (DB_PORT)
- Verify firewall isn't blocking port 5432

**Permission errors:**
- Ensure `.env` file exists with correct credentials
- Check PostgreSQL logs for authentication errors

### Files Structure

```
Backend/
├── docker-compose.yml          # Docker configuration (already set up)
├── .env                        # Environment variables (create from .env.example)
├── .env.example               # Template for environment variables
├── init-scripts/              # Auto-executed SQL scripts
│   └── 01-init-schema.sql    # Database schema (automatically runs)
└── DATABASE_SETUP.md          # This file
```

### Important Notes

- **First-time setup only:** Init scripts run once on empty database
- **Data persistence:** Database data is stored in Docker volume `postgres_data`
- **Team consistency:** Everyone gets the same schema automatically
- **No manual SQL:** No need to manually run scripts on fresh setups
- **Version control:** All schema changes should be in `init-scripts/`

### Testing the Setup

```bash
# Connect to PostgreSQL
docker exec -it postgres psql -U postgres -d backend_db

# List all tables
\dt

# Describe a table
\d assets

# Exit
\q
```

## Summary

Your Docker setup is **already configured** to automatically initialize the database. Teammates just need to:
1. Clone the repo
2. Copy `.env.example` to `.env`
3. Run `docker-compose up -d`

The `init-scripts/01-init-schema.sql` file will execute automatically, creating all tables, indexes, and triggers.
