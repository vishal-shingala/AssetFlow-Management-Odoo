-- AssetFlow Database Schema (PostgreSQL)
-- Enterprise Asset & Resource Management System
-- This script runs automatically on first PostgreSQL container start

-- ============================================
-- 1. Organization Tables (create first - no dependencies)
-- ============================================

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_department_id INTEGER NULL,
    department_head_id INTEGER NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    FOREIGN KEY (parent_department_id) REFERENCES departments(department_id)
);

-- Add foreign key constraint from users to departments now that departments table exists
ALTER TABLE users ADD CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(department_id);


-- Asset Categories
CREATE TABLE IF NOT EXISTS asset_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- ============================================
-- 2. Users Table (depends on departments)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_id INTEGER NULL,
    role VARCHAR(50) DEFAULT 'EMPLOYEE' CHECK (role IN ('EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN')),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add department_head_id foreign key after users table is created
ALTER TABLE departments ADD CONSTRAINT fk_department_head FOREIGN KEY (department_head_id) REFERENCES users(user_id);

-- ============================================
-- 3. Assets Table
-- ============================================
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    category_id INTEGER NOT NULL,
    serial_number VARCHAR(100) UNIQUE NULL,
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(15,2) NULL,
    condition VARCHAR(50) DEFAULT 'GOOD',
    location VARCHAR(255) NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED')),
    photo_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES asset_categories(category_id)
);

-- ============================================
-- 4. Asset Allocation Table
-- ============================================
CREATE TABLE IF NOT EXISTS asset_allocations (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    allocated_date DATE NOT NULL,
    expected_return_date DATE NULL,
    actual_return_date DATE NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RETURNED')),
    condition_notes TEXT NULL,
    remarks TEXT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (employee_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- ============================================
-- 5. Transfer Requests Table
-- ============================================
CREATE TABLE IF NOT EXISTS transfer_requests (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL,
    from_employee INTEGER NOT NULL,
    to_employee INTEGER NOT NULL,
    requested_by INTEGER NOT NULL,
    approved_by INTEGER NULL,
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED')),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (from_employee) REFERENCES users(user_id),
    FOREIGN KEY (to_employee) REFERENCES users(user_id),
    FOREIGN KEY (requested_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- ============================================
-- 6. Transfer History Table
-- ============================================
CREATE TABLE IF NOT EXISTS transfer_history (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by INTEGER NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (performed_by) REFERENCES users(user_id)
);

-- ============================================
-- 7. Resource Bookings Table
-- ============================================
CREATE TABLE IF NOT EXISTS resource_bookings (
    booking_id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT NULL,
    status VARCHAR(50) DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED')),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (employee_id) REFERENCES users(user_id)
);

-- ============================================
-- 8. Maintenance Requests Table
-- ============================================
CREATE TABLE IF NOT EXISTS maintenance_requests (
    request_id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL,
    reported_by INTEGER NOT NULL,
    issue_description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'RESOLVED')),
    approved_by INTEGER NULL,
    technician_id INTEGER NULL,
    resolution_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (reported_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id),
    FOREIGN KEY (technician_id) REFERENCES users(user_id)
);

-- ============================================
-- 9. Audit Tables
-- ============================================

-- Audit Cycles
CREATE TABLE IF NOT EXISTS audit_cycles (
    audit_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id INTEGER NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'PLANNED' CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED')),
    created_by INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Audit Findings
CREATE TABLE IF NOT EXISTS audit_findings (
    finding_id SERIAL PRIMARY KEY,
    audit_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    auditor_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('VERIFIED', 'MISSING', 'DAMAGED')),
    notes TEXT NULL,
    FOREIGN KEY (audit_id) REFERENCES audit_cycles(audit_id),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (auditor_id) REFERENCES users(user_id)
);

-- ============================================
-- 10. Notifications Table
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================================
-- 11. Activity Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);

-- Assets indexes
CREATE INDEX IF NOT EXISTS idx_assets_tag ON assets(asset_tag);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_is_shared ON assets(is_shared);

-- Asset Allocations indexes
CREATE INDEX IF NOT EXISTS idx_allocations_asset ON asset_allocations(asset_id);
CREATE INDEX IF NOT EXISTS idx_allocations_employee ON asset_allocations(employee_id);
CREATE INDEX IF NOT EXISTS idx_allocations_department ON asset_allocations(department_id);
CREATE INDEX IF NOT EXISTS idx_allocations_status ON asset_allocations(status);
CREATE INDEX IF NOT EXISTS idx_allocations_expected_return ON asset_allocations(expected_return_date);

-- Transfer Requests indexes
CREATE INDEX IF NOT EXISTS idx_transfers_asset ON transfer_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_employee ON transfer_requests(from_employee);
CREATE INDEX IF NOT EXISTS idx_transfers_to_employee ON transfer_requests(to_employee);
CREATE INDEX IF NOT EXISTS idx_transfers_status ON transfer_requests(status);

-- Transfer History indexes
CREATE INDEX IF NOT EXISTS idx_transfer_history_asset ON transfer_history(asset_id);
CREATE INDEX IF NOT EXISTS idx_transfer_history_performed_by ON transfer_history(performed_by);

-- Resource Bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_asset ON resource_bookings(asset_id);
CREATE INDEX IF NOT EXISTS idx_bookings_employee ON resource_bookings(employee_id);
CREATE INDEX IF NOT EXISTS idx_bookings_time_range ON resource_bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON resource_bookings(status);

-- Maintenance Requests indexes
CREATE INDEX IF NOT EXISTS idx_maintenance_asset ON maintenance_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_reported_by ON maintenance_requests(reported_by);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON maintenance_requests(priority);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_audit_cycles_status ON audit_cycles(status);
CREATE INDEX IF NOT EXISTS idx_audit_cycles_date_range ON audit_cycles(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_audit_findings_audit ON audit_findings(audit_id);
CREATE INDEX IF NOT EXISTS idx_audit_findings_asset ON audit_findings(asset_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Activity Logs indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- ============================================
-- Trigger for updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
