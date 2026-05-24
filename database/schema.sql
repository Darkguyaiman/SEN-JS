-- Sen JS sample schema
CREATE DATABASE IF NOT EXISTS sen_app;
USE sen_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role ENUM('Admin', 'Editor', 'Viewer') DEFAULT 'Viewer',
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
  created_at DATE NOT NULL DEFAULT (CURRENT_DATE)
);

INSERT INTO users (name, email, role, status, created_at) VALUES
  ('Sarah Chen', 'sarah@example.com', 'Admin', 'active', '2026-05-01'),
  ('James Wilson', 'james@example.com', 'Editor', 'active', '2026-05-03'),
  ('Maria Garcia', 'maria@example.com', 'Viewer', 'inactive', '2026-05-10'),
  ('Alex Thompson', 'alex@example.com', 'Editor', 'active', '2026-05-15'),
  ('Priya Patel', 'priya@example.com', 'Admin', 'active', '2026-05-18')
ON DUPLICATE KEY UPDATE name = VALUES(name);
