-- ============================================
-- AdvoDesk Database Schema and Sample Data
-- Legal Case Management System
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS advo_desk;
USE advo_desk;

-- ============================================
-- TABLE: admins
-- Stores administrator users
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: advocates
-- Stores advocate/lawyer users with verification
-- ============================================
CREATE TABLE IF NOT EXISTS advocates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    enrollment_number VARCHAR(50) UNIQUE,
    enrollment_document_path VARCHAR(500),
    verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    verified_by BIGINT,
    verified_at DATETIME,
    rejection_reason VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: users
-- Base user table for references
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'ADVOCATE') NOT NULL,
    phone VARCHAR(15),
    enrollment_number VARCHAR(50) UNIQUE,
    enrollment_document_path VARCHAR(500),
    verification_status ENUM('PENDING', 'APPROVED', 'REJECTED'),
    verified_by BIGINT,
    verified_at DATETIME,
    rejection_reason VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: clients
-- Stores client information
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- TABLE: cases
-- Stores legal case information
-- ============================================
CREATE TABLE IF NOT EXISTS cases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    case_title VARCHAR(200) NOT NULL,
    case_type ENUM('CIVIL', 'CRIMINAL') NOT NULL,
    court_name VARCHAR(150) NOT NULL,
    case_status ENUM('OPEN', 'CLOSED', 'WON', 'LOST') DEFAULT 'OPEN',
    description TEXT,
    filing_date DATE NOT NULL,
    client_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: hearings
-- Stores court hearing information
-- ============================================
CREATE TABLE IF NOT EXISTS hearings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    hearing_date DATETIME NOT NULL,
    hearing_type VARCHAR(100),
    court_room VARCHAR(50),
    judge_name VARCHAR(100),
    notes TEXT,
    status ENUM('SCHEDULED', 'COMPLETED', 'POSTPONED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- ============================================
-- TABLE: documents
-- Stores case-related documents
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    case_id BIGINT NOT NULL,
    document_name VARCHAR(200) NOT NULL,
    document_type VARCHAR(50),
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    uploaded_by BIGINT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert Admin User
INSERT INTO admins (username, password, email, full_name, phone, created_at, updated_at) VALUES
('admin', 'admin123', 'admin@advodesk.com', 'System Administrator', '1234567890', NOW(), NOW());

-- Insert Advocates (2 APPROVED, 2 PENDING for testing)
INSERT INTO advocates (username, password, email, full_name, phone, enrollment_number, enrollment_document_path, verification_status, created_at, updated_at) VALUES
('advocate1', 'pass123', 'rajesh.sharma@lawfirm.com', 'Rajesh Sharma', '9876543210', 'MAH/12345/2020', '/uploads/enrollment/1_enrollment.pdf', 'APPROVED', NOW(), NOW()),
('advocate2', 'pass123', 'priya.patel@legal.com', 'Priya Patel', '9876543211', 'GJ/23456/2019', '/uploads/enrollment/2_enrollment.pdf', 'APPROVED', NOW(), NOW()),
('advocate3', 'pass123', 'amit.kumar@advocates.in', 'Amit Kumar', '9876543212', 'UP/34567/2021', '/uploads/enrollment/3_enrollment.pdf', 'PENDING', NOW(), NOW()),
('advocate4', 'pass123', 'sneha.reddy@lawchamber.com', 'Sneha Reddy', '9876543213', 'TN/45678/2022', '/uploads/enrollment/4_enrollment.pdf', 'PENDING', NOW(), NOW());

-- Insert Users (for foreign key references)
INSERT INTO users (username, password, email, full_name, role, phone, created_at, updated_at) 
SELECT username, password, email, full_name, 'ADMIN', phone, created_at, updated_at FROM admins WHERE id = 1;

INSERT INTO users (username, password, email, full_name, role, phone, enrollment_number, enrollment_document_path, verification_status, created_at, updated_at)
SELECT username, password, email, full_name, 'ADVOCATE', phone, enrollment_number, enrollment_document_path, verification_status, created_at, updated_at 
FROM advocates WHERE verification_status = 'APPROVED';

-- Insert Clients
INSERT INTO clients (full_name, email, phone, address, city, state, pincode, created_at, updated_at) VALUES
('Ramesh Industries Pvt Ltd', 'contact@rameshindustries.com', '9123456780', '123 MG Road', 'Mumbai', 'Maharashtra', '400001', NOW(), NOW()),
('Sunita Verma', 'sunita.verma@email.com', '9123456781', '45 Park Street', 'Kolkata', 'West Bengal', '700016', NOW(), NOW()),
('Tech Solutions Inc', 'info@techsolutions.in', '9123456782', '78 Cyber City', 'Gurgaon', 'Haryana', '122002', NOW(), NOW()),
('Anand Builders', 'anand@builders.com', '9123456783', '90 Ring Road', 'Bangalore', 'Karnataka', '560001', NOW(), NOW()),
('Meera Enterprises', 'meera@enterprises.in', '9123456784', '12 Civil Lines', 'Delhi', 'Delhi', '110054', NOW(), NOW());

-- Insert Cases
INSERT INTO cases (case_number, case_title, case_type, court_name, case_status, description, filing_date, client_id, created_by, created_at, updated_at) VALUES
('CIV/2024/001', 'Property Dispute - Ramesh Industries', 'CIVIL', 'Mumbai High Court', 'OPEN', 'Dispute over commercial property ownership in Mumbai', '2024-01-15', 1, 2, NOW(), NOW()),
('CRIMINAL/2024/002', 'Fraud Case - Tech Solutions', 'CRIMINAL', 'Delhi District Court', 'OPEN', 'Corporate fraud investigation and prosecution', '2024-02-20', 3, 3, NOW(), NOW()),
('CIV/2024/003', 'Contract Dispute - Anand Builders', 'CIVIL', 'Karnataka High Court', 'OPEN', 'Breach of construction contract', '2024-03-05', 4, 3, NOW(), NOW()),
('CIV/2023/004', 'Divorce Settlement - Sunita Verma', 'CIVIL', 'Kolkata Family Court', 'CLOSED', 'Property settlement post divorce', '2023-11-10', 2, 2, NOW(), NOW()),
('CIV/2024/005', 'Labor Dispute - Meera Enterprises', 'CIVIL', 'Delhi Labor Court', 'WON', 'Wrongful termination case - won in favor of employee', '2024-01-25', 5, 2, NOW(), NOW());

-- Insert Hearings
INSERT INTO hearings (case_id, hearing_date, hearing_type, court_room, judge_name, notes, status, created_at, updated_at) VALUES
(1, '2024-12-30 10:30:00', 'Initial Hearing', 'Court Room 5', 'Justice Mehta', 'Bring all property documents and ownership proofs', 'SCHEDULED', NOW(), NOW()),
(2, '2025-01-10 11:00:00', 'Witness Examination', 'Court Room 2', 'Justice Singh', 'Key witnesses to be present with identification', 'SCHEDULED', NOW(), NOW()),
(3, '2025-01-15 14:00:00', 'Contract Review', 'Court Room 8', 'Justice Rao', 'Original contract documents required', 'SCHEDULED', NOW(), NOW()),
(5, '2024-12-28 09:30:00', 'Final Arguments', 'Court Room 3', 'Justice Sharma', 'Prepare closing statements', 'SCHEDULED', NOW(), NOW()),
(1, '2024-11-20 10:00:00', 'Case Filing', 'Court Room 5', 'Justice Mehta', 'Case admitted for hearing', 'COMPLETED', NOW(), NOW()),
(4, '2023-12-15 11:30:00', 'Final Hearing', 'Court Room 7', 'Justice Banerjee', 'Settlement finalized', 'COMPLETED', NOW(), NOW());

-- Insert Documents
INSERT INTO documents (case_id, document_name, document_type, file_path, file_size, uploaded_by, uploaded_at, description) VALUES
(1, 'Property Deed Original', 'DEED', '/documents/case1/property_deed.pdf', 524288, 2, NOW(), 'Original property ownership deed with registration details'),
(1, 'Sale Agreement 2020', 'CONTRACT', '/documents/case1/sale_agreement.pdf', 312576, 2, NOW(), 'Sale agreement dated 2020 between parties'),
(2, 'Financial Audit Report', 'EVIDENCE', '/documents/case2/audit_report.pdf', 1048576, 3, NOW(), 'Forensic audit findings showing discrepancies'),
(2, 'Email Communications', 'EVIDENCE', '/documents/case2/emails.pdf', 256000, 3, NOW(), 'Email trail showing fraudulent activities'),
(3, 'Construction Contract', 'CONTRACT', '/documents/case4/construction_contract.pdf', 450000, 3, NOW(), 'Original signed construction contract'),
(3, 'Breach Notice', 'NOTICE', '/documents/case4/breach_notice.pdf', 128000, 3, NOW(), 'Legal notice of contract breach'),
(4, 'Divorce Settlement Agreement', 'CONTRACT', '/documents/case3/settlement.pdf', 350000, 2, NOW(), 'Final settlement agreement signed by both parties'),
(5, 'Employment Contract', 'CONTRACT', '/documents/case5/employment_contract.pdf', 200000, 2, NOW(), 'Original employment agreement'),
(5, 'Termination Letter', 'NOTICE', '/documents/case5/termination_letter.pdf', 150000, 2, NOW(), 'Wrongful termination notice received');

-- ============================================
-- END OF SCRIPT
-- ============================================
