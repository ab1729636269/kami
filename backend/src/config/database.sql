-- 创建数据库
CREATE DATABASE IF NOT EXISTS kami CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE kami;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 卡密类型表
CREATE TABLE IF NOT EXISTS kami_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    length INT DEFAULT 16,
    prefix VARCHAR(10),
    suffix VARCHAR(10),
    validity_days INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 卡密表
CREATE TABLE IF NOT EXISTS kamis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    type_id INT NOT NULL,
    status ENUM('unused', 'used', 'expired') DEFAULT 'unused',
    user_id INT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP,
    expired_at TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES kami_types(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 用户卡密关联表
CREATE TABLE IF NOT EXISTS user_kamis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    kami_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (kami_id) REFERENCES kamis(id)
);

-- 日志表
CREATE TABLE IF NOT EXISTS logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 插入默认数据
INSERT INTO users (email, password, name, is_admin) VALUES
('admin@example.com', '$2b$10$eE4e7G7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e', '管理员', TRUE),
('user@example.com', '$2b$10$eE4e7G7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e7e', '普通用户', FALSE);

INSERT INTO kami_types (name, description, length, prefix, suffix, validity_days) VALUES
('普通卡密', '适用于一般场景的卡密', 16, 'KAMI', '', 30),
('高级卡密', '适用于高级场景的卡密', 20, 'PREMIUM', '', 90),
('测试卡密', '用于测试的卡密', 12, 'TEST', '', 7);