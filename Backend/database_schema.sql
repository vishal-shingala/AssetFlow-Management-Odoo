-- AssetFlow Database Schema
-- Enterprise Asset & Resource Management System

-- ============================================
-- 1. Users Table (includes employee data)
-- ============================================
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_id INT NULL,
    role ENUM('EMPLOYEE', 'DEPARTMENT_HEAD', 'ASSET_MANAGER', 'ADMIN') DEFAULT 'EMPLOYEE',
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- ============================================
-- 2. Organization Tables
-- ============================================

-- Departments
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    parent_department_id INT NULL,
    department_head_id INT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    FOREIGN KEY (parent_department_id) REFERENCES departments(department_id),
    FOREIGN KEY (department_head_id) REFERENCES users(user_id)
);

-- Asset Categories
CREATE TABLE asset_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE'
);

-- ============================================
-- 3. Assets Table
-- ============================================
CREATE TABLE assets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    serial_number VARCHAR(100) UNIQUE NULL,
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(15,2) NULL,
    condition VARCHAR(50) DEFAULT 'GOOD',
    location VARCHAR(255) NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    status ENUM('AVAILABLE', 'ALLOCATED', 'RESERVED', 'UNDER_MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED') DEFAULT 'AVAILABLE',
    photo_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES asset_categories(category_id)
);

-- ============================================
-- 4. Asset Allocation Table
-- ============================================
CREATE TABLE asset_allocations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    employee_id INT NOT NULL,
    department_id INT NOT NULL,
    allocated_date DATE NOT NULL,
    expected_return_date DATE NULL,
    actual_return_date DATE NULL,
    status ENUM('ACTIVE', 'RETURNED') DEFAULT 'ACTIVE',
    condition_notes TEXT NULL,
    remarks TEXT NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (employee_id) REFERENCES users(user_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- ============================================
-- 5. Transfer Requests Table
-- ============================================
CREATE TABLE transfer_requests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    from_employee INT NOT NULL,
    to_employee INT NOT NULL,
    requested_by INT NOT NULL,
    approved_by INT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
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
CREATE TABLE transfer_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by INT NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (performed_by) REFERENCES users(user_id)
);

-- ============================================
-- 7. Resource Bookings Table
-- ============================================
CREATE TABLE resource_bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    employee_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose TEXT NULL,
    status ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED') DEFAULT 'UPCOMING',
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (employee_id) REFERENCES users(user_id)
);

-- ============================================
-- 8. Maintenance Requests Table
-- ============================================
CREATE TABLE maintenance_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    asset_id INT NOT NULL,
    reported_by INT NOT NULL,
    issue_description TEXT NOT NULL,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'RESOLVED') DEFAULT 'PENDING',
    approved_by INT NULL,
    technician_id INT NULL,
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
CREATE TABLE audit_cycles (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    department_id INT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PLANNED',
    created_by INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(department_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Audit Findings
CREATE TABLE audit_findings (
    finding_id INT PRIMARY KEY AUTO_INCREMENT,
    audit_id INT NOT NULL,
    asset_id INT NOT NULL,
    auditor_id INT NOT NULL,
    status ENUM('VERIFIED', 'MISSING', 'DAMAGED') NOT NULL,
    notes TEXT NULL,
    FOREIGN KEY (audit_id) REFERENCES audit_cycles(audit_id),
    FOREIGN KEY (asset_id) REFERENCES assets(id),
    FOREIGN KEY (auditor_id) REFERENCES users(user_id)
);

-- ============================================
-- 10. Notifications Table
-- ============================================
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
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
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ============================================
-- Indexes for Performance
-- ============================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department_id);

-- Assets indexes
CREATE INDEX idx_assets_tag ON assets(asset_tag);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_assets_is_shared ON assets(is_shared);

-- Asset Allocations indexes
CREATE INDEX idx_allocations_asset ON asset_allocations(asset_id);
CREATE INDEX idx_allocations_employee ON asset_allocations(employee_id);
CREATE INDEX idx_allocations_department ON asset_allocations(department_id);
CREATE INDEX idx_allocations_status ON asset_allocations(status);
CREATE INDEX idx_allocations_expected_return ON asset_allocations(expected_return_date);

-- Transfer Requests indexes
CREATE INDEX idx_transfers_asset ON transfer_requests(asset_id);
CREATE INDEX idx_transfers_from_employee ON transfer_requests(from_employee);
CREATE INDEX idx_transfers_to_employee ON transfer_requests(to_employee);
CREATE INDEX idx_transfers_status ON transfer_requests(status);

-- Transfer History indexes
CREATE INDEX idx_transfer_history_asset ON transfer_history(asset_id);
CREATE INDEX idx_transfer_history_performed_by ON transfer_history(performed_by);

-- Resource Bookings indexes
CREATE INDEX idx_bookings_asset ON resource_bookings(asset_id);
CREATE INDEX idx_bookings_employee ON resource_bookings(employee_id);
CREATE INDEX idx_bookings_time_range ON resource_bookings(start_time, end_time);
CREATE INDEX idx_bookings_status ON resource_bookings(status);

-- Maintenance Requests indexes
CREATE INDEX idx_maintenance_asset ON maintenance_requests(asset_id);
CREATE INDEX idx_maintenance_reported_by ON maintenance_requests(reported_by);
CREATE INDEX idx_maintenance_status ON maintenance_requests(status);
CREATE INDEX idx_maintenance_priority ON maintenance_requests(priority);

-- Audit indexes
CREATE INDEX idx_audit_cycles_status ON audit_cycles(status);
CREATE INDEX idx_audit_cycles_date_range ON audit_cycles(start_date, end_date);
CREATE INDEX idx_audit_findings_audit ON audit_findings(audit_id);
CREATE INDEX idx_audit_findings_asset ON audit_findings(asset_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Activity Logs indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
