-- TELMI Database Migration Script
-- Version: 1.0.0
-- Date: 2024-02-15

-- Create Database
CREATE DATABASE IF NOT EXISTS telmi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE telmi_db;

-- Table: packages
CREATE TABLE packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    data_quota DECIMAL(10, 2),
    data_quota_type ENUM('daily', 'monthly', 'unlimited') DEFAULT 'monthly',
    sms_quota INT DEFAULT 0,
    call_quota INT DEFAULT 0,
    features JSON,
    status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: customers
CREATE TABLE customers (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    address TEXT,
    current_package_id INT,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (current_package_id) REFERENCES packages(id) ON DELETE SET NULL,
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_join_date (join_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: customer_packages
CREATE TABLE customer_packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    package_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    INDEX idx_customer_package (customer_id, package_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: usage_logs
CREATE TABLE usage_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    package_id INT NOT NULL,
    log_date DATE NOT NULL,
    data_used DECIMAL(10, 2) DEFAULT 0,
    sms_used INT DEFAULT 0,
    call_duration INT DEFAULT 0,
    peak_hours_usage DECIMAL(10, 2) DEFAULT 0,
    off_peak_hours_usage DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    INDEX idx_customer_date (customer_id, log_date),
    INDEX idx_log_date (log_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ml_model_versions
CREATE TABLE ml_model_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    version VARCHAR(20) UNIQUE NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_path VARCHAR(255),
    accuracy DECIMAL(5, 2),
    is_active BOOLEAN DEFAULT FALSE,
    description TEXT,
    trained_at TIMESTAMP,
    deployed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ml_recommendations
CREATE TABLE ml_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    current_package_id INT,
    recommended_package_id INT NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL,
    ml_model_version VARCHAR(20) NOT NULL,
    recommendation_reason TEXT,
    status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (current_package_id) REFERENCES packages(id),
    FOREIGN KEY (recommended_package_id) REFERENCES packages(id),
    INDEX idx_customer_status (customer_id, status),
    INDEX idx_status (status),
    INDEX idx_generated_at (generated_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: ml_model_features
CREATE TABLE ml_model_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recommendation_id INT NOT NULL,
    feature_name VARCHAR(100) NOT NULL,
    feature_value DECIMAL(10, 4) NOT NULL,
    feature_weight DECIMAL(5, 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recommendation_id) REFERENCES ml_recommendations(id) ON DELETE CASCADE,
    INDEX idx_recommendation (recommendation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: feedback
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    recommendation_id INT,
    feedback_type ENUM('recommendation', 'service', 'package') NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (recommendation_id) REFERENCES ml_recommendations(id) ON DELETE SET NULL,
    INDEX idx_customer (customer_id),
    INDEX idx_recommendation (recommendation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: transactions
CREATE TABLE transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    package_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'e_wallet', 'sms') NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_date TIMESTAMP NULL,
    reference_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    INDEX idx_customer (customer_id),
    INDEX idx_status (status),
    INDEX idx_transaction_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: admin_users
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('super_admin', 'admin', 'operator') DEFAULT 'operator',
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: system_settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES admin_users(id),
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data: Packages
INSERT INTO packages (name, code, price, data_quota, data_quota_type, sms_quota, call_quota, status, description) VALUES
('Hemat Data', 'HEMAT_DATA', 50000.00, 10.00, 'monthly', 100, 0, 'active', 'Paket hemat untuk penggunaan data ringan'),
('Unlimited+', 'UNLIMITED_PLUS', 120000.00, NULL, 'unlimited', 0, 500, 'active', 'Paket unlimited dengan kuota telepon'),
('Premium+', 'PREMIUM_PLUS', 250000.00, NULL, 'unlimited', 0, 1000, 'active', 'Paket premium dengan fitur lengkap'),
('Paket 2210', 'PAKET_2210', 180000.00, 30.00, 'daily', 0, 0, 'active', 'Paket khusus dengan 1GB/hari untuk kebutuhan harian');

-- Insert Sample Data: ML Model Versions
INSERT INTO ml_model_versions (version, model_name, accuracy, is_active, description, trained_at, deployed_at) VALUES
('v2.1', 'Package Recommendation Model v2.1', 87.50, TRUE, 'Model terbaru dengan improved accuracy', NOW(), NOW()),
('v2.0', 'Package Recommendation Model v2.0', 82.30, FALSE, 'Model sebelumnya', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 30 DAY));

-- Insert Sample Data: Admin User (password: admin123 - harus di-hash dengan bcrypt)
-- Default password hash untuk 'admin123' (gunakan bcrypt di aplikasi)
INSERT INTO admin_users (username, email, password_hash, full_name, role, status) VALUES
('admin', 'admin@telmi.com', '$2b$10$YourHashedPasswordHere', 'Administrator', 'super_admin', 'active');

-- Insert Sample Data: System Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'TELMI', 'string', 'Nama situs'),
('site_description', 'Penyedia Jasa Telekomunikasi Terpercaya', 'string', 'Deskripsi situs'),
('contact_email', 'telmibgt@gmail.com', 'string', 'Email kontak'),
('contact_phone', '0889-4456-2334', 'string', 'Nomor telepon kontak'),
('contact_address', 'Depok', 'string', 'Alamat kontak'),
('ml_api_url', 'https://api.telmi.com/ml', 'string', 'URL API Machine Learning'),
('enable_recommendations', 'true', 'boolean', 'Aktifkan rekomendasi otomatis'),
('enable_notifications', 'true', 'boolean', 'Aktifkan notifikasi');

-- Create Views
CREATE OR REPLACE VIEW customer_usage_summary AS
SELECT 
    c.id AS customer_id,
    c.name AS customer_name,
    p.name AS current_package,
    SUM(ul.data_used) AS total_data_used,
    SUM(ul.sms_used) AS total_sms_used,
    SUM(ul.call_duration) AS total_call_duration,
    COUNT(DISTINCT ul.log_date) AS active_days
FROM customers c
LEFT JOIN usage_logs ul ON c.id = ul.customer_id
LEFT JOIN packages p ON c.current_package_id = p.id
GROUP BY c.id, c.name, p.name;

CREATE OR REPLACE VIEW recommendation_stats AS
SELECT 
    DATE(generated_at) AS date,
    COUNT(*) AS total_recommendations,
    SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted,
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
    AVG(confidence_score) AS avg_confidence
FROM ml_recommendations
GROUP BY DATE(generated_at);

