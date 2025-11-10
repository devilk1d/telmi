# Database Schema - TELMI System

Dokumentasi lengkap database schema untuk sistem TELMI dengan integrasi Machine Learning.

## Overview

Database ini dirancang untuk mendukung:
- Manajemen pelanggan dan paket
- Sistem rekomendasi berbasis ML
- Tracking penggunaan dan feedback
- Analytics dan reporting

## Database: `telmi_db`

---

## Tabel 1: `customers` (Pelanggan)

Menyimpan informasi pelanggan TELMI.

```sql
CREATE TABLE customers (
    id VARCHAR(20) PRIMARY KEY,              -- C001, C002, dll
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100),
    address TEXT,
    current_package_id INT,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (current_package_id) REFERENCES packages(id)
);
```

**Index:**
- `idx_phone` pada `phone`
- `idx_status` pada `status`
- `idx_join_date` pada `join_date`

---

## Tabel 2: `packages` (Paket Layanan)

Menyimpan informasi paket layanan yang tersedia.

```sql
CREATE TABLE packages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,             -- Hemat Data, Unlimited+, Premium+
    code VARCHAR(50) UNIQUE NOT NULL,        -- HEMAT_DATA, UNLIMITED_PLUS, dll
    price DECIMAL(10, 2) NOT NULL,
    data_quota DECIMAL(10, 2),              -- GB
    data_quota_type ENUM('daily', 'monthly', 'unlimited') DEFAULT 'monthly',
    sms_quota INT DEFAULT 0,
    call_quota INT DEFAULT 0,               -- menit
    features JSON,                           -- Fitur tambahan dalam format JSON
    status ENUM('active', 'inactive', 'archived') DEFAULT 'active',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Index:**
- `idx_code` pada `code`
- `idx_status` pada `status`

---

## Tabel 3: `customer_packages` (Riwayat Paket Pelanggan)

Menyimpan riwayat paket yang pernah digunakan pelanggan.

```sql
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
);
```

---

## Tabel 4: `usage_logs` (Log Penggunaan)

Menyimpan log penggunaan data, SMS, dan telepon untuk analisis ML.

```sql
CREATE TABLE usage_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    package_id INT NOT NULL,
    log_date DATE NOT NULL,
    data_used DECIMAL(10, 2) DEFAULT 0,     -- GB
    sms_used INT DEFAULT 0,
    call_duration INT DEFAULT 0,            -- menit
    peak_hours_usage DECIMAL(10, 2) DEFAULT 0,
    off_peak_hours_usage DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id),
    INDEX idx_customer_date (customer_id, log_date),
    INDEX idx_log_date (log_date)
);
```

---

## Tabel 5: `ml_recommendations` (Rekomendasi ML)

Menyimpan rekomendasi paket yang dihasilkan oleh sistem ML.

```sql
CREATE TABLE ml_recommendations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id VARCHAR(20) NOT NULL,
    current_package_id INT,
    recommended_package_id INT NOT NULL,
    confidence_score DECIMAL(5, 2) NOT NULL, -- 0.00 - 100.00
    ml_model_version VARCHAR(20) NOT NULL,   -- v2.0, v2.1, dll
    recommendation_reason TEXT,               -- Alasan rekomendasi dari ML
    status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,               -- Rekomendasi kadaluarsa setelah X hari
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (current_package_id) REFERENCES packages(id),
    FOREIGN KEY (recommended_package_id) REFERENCES packages(id),
    INDEX idx_customer_status (customer_id, status),
    INDEX idx_status (status),
    INDEX idx_generated_at (generated_at)
);
```

---

## Tabel 6: `ml_model_features` (Fitur ML Model)

Menyimpan fitur-fitur yang digunakan model ML untuk prediksi.

```sql
CREATE TABLE ml_model_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recommendation_id INT NOT NULL,
    feature_name VARCHAR(100) NOT NULL,     -- avg_daily_usage, peak_hours_ratio, dll
    feature_value DECIMAL(10, 4) NOT NULL,
    feature_weight DECIMAL(5, 4),            -- Bobot fitur dalam model
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recommendation_id) REFERENCES ml_recommendations(id) ON DELETE CASCADE,
    INDEX idx_recommendation (recommendation_id)
);
```

---

## Tabel 7: `feedback` (Feedback Pelanggan)

Menyimpan feedback pelanggan terhadap rekomendasi atau layanan.

```sql
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
);
```

---

## Tabel 8: `ml_model_versions` (Versi Model ML)

Menyimpan informasi versi model ML yang digunakan.

```sql
CREATE TABLE ml_model_versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    version VARCHAR(20) UNIQUE NOT NULL,     -- v2.0, v2.1, dll
    model_name VARCHAR(100) NOT NULL,
    model_path VARCHAR(255),                 -- Path ke file model
    accuracy DECIMAL(5, 2),                  -- Akurasi model
    is_active BOOLEAN DEFAULT FALSE,
    description TEXT,
    trained_at TIMESTAMP,
    deployed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
);
```

---

## Tabel 9: `transactions` (Transaksi Pembayaran)

Menyimpan riwayat transaksi pembayaran paket.

```sql
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
);
```

---

## Tabel 10: `admin_users` (Admin CMS)

Menyimpan data admin yang bisa akses CMS.

```sql
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
);
```

---

## Tabel 11: `system_settings` (Pengaturan Sistem)

Menyimpan pengaturan sistem yang bisa diubah dari CMS.

```sql
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
);
```

---

## Views (Optional - untuk reporting)

### View: `customer_usage_summary`
```sql
CREATE VIEW customer_usage_summary AS
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
```

### View: `recommendation_stats`
```sql
CREATE VIEW recommendation_stats AS
SELECT 
    DATE(generated_at) AS date,
    COUNT(*) AS total_recommendations,
    SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted,
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
    AVG(confidence_score) AS avg_confidence
FROM ml_recommendations
GROUP BY DATE(generated_at);
```

---

## Sample Data

### Insert Packages
```sql
INSERT INTO packages (name, code, price, data_quota, data_quota_type, sms_quota, call_quota, status) VALUES
('Hemat Data', 'HEMAT_DATA', 50000.00, 10.00, 'monthly', 100, 0, 'active'),
('Unlimited+', 'UNLIMITED_PLUS', 120000.00, NULL, 'unlimited', 0, 500, 'active'),
('Premium+', 'PREMIUM_PLUS', 250000.00, NULL, 'unlimited', 0, 1000, 'active'),
('Paket 2210', 'PAKET_2210', 180000.00, 30.00, 'daily', 0, 0, 'active');
```

### Insert ML Model Version
```sql
INSERT INTO ml_model_versions (version, model_name, accuracy, is_active, description) VALUES
('v2.1', 'Package Recommendation Model v2.1', 87.50, TRUE, 'Model terbaru dengan improved accuracy'),
('v2.0', 'Package Recommendation Model v2.0', 82.30, FALSE, 'Model sebelumnya');
```

---

## Relasi Database

```
customers (1) ──< (N) customer_packages
customers (1) ──< (N) usage_logs
customers (1) ──< (N) ml_recommendations
customers (1) ──< (N) feedback
customers (1) ──< (N) transactions

packages (1) ──< (N) customer_packages
packages (1) ──< (N) usage_logs
packages (1) ──< (N) ml_recommendations
packages (1) ──< (N) transactions

ml_recommendations (1) ──< (N) ml_model_features
ml_recommendations (1) ──< (N) feedback
```

---

## Catatan Penting

1. **Indexing**: Semua foreign key dan kolom yang sering digunakan untuk query sudah di-index
2. **Cascade Delete**: Beberapa relasi menggunakan `ON DELETE CASCADE` untuk menjaga integritas data
3. **Timestamps**: Semua tabel memiliki `created_at` dan `updated_at` untuk tracking
4. **ENUM Types**: Menggunakan ENUM untuk memastikan data konsisten
5. **JSON Fields**: Beberapa field menggunakan JSON untuk fleksibilitas (features, settings)

---

## Migration Script

File SQL lengkap untuk membuat semua tabel tersedia di: `database/migrations/001_create_tables.sql`

---

**Last Updated**: 2024-02-15
**Version**: 1.0.0

