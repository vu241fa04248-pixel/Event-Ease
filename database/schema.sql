CREATE DATABASE IF NOT EXISTS event_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE event_management;

CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(190) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 role ENUM('attendee','organizer','admin') NOT NULL DEFAULT 'attendee',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 organizer_id BIGINT UNSIGNED NOT NULL,
 title VARCHAR(180) NOT NULL,
 description TEXT NOT NULL,
 category VARCHAR(60) NOT NULL,
 event_date DATE NOT NULL,
 event_time VARCHAR(30) NOT NULL,
 location VARCHAR(255) NOT NULL,
 ticket_price DECIMAL(10,2) NOT NULL DEFAULT 0,
 total_tickets INT UNSIGNED NULL,
 sold_tickets INT UNSIGNED NOT NULL DEFAULT 0,
 image_url TEXT NULL,
 status ENUM('draft','published','cancelled') NOT NULL DEFAULT 'published',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_events_organizer FOREIGN KEY(organizer_id) REFERENCES users(id),
 INDEX idx_events_date(event_date),
 INDEX idx_events_category(category)
);

CREATE TABLE IF NOT EXISTS bookings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 event_id BIGINT UNSIGNED NOT NULL,
 quantity INT UNSIGNED NOT NULL,
 total_amount DECIMAL(10,2) NOT NULL,
 status ENUM('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_bookings_user FOREIGN KEY(user_id) REFERENCES users(id),
 CONSTRAINT fk_bookings_event FOREIGN KEY(event_id) REFERENCES events(id),
 INDEX idx_bookings_user(user_id)
);

CREATE TABLE IF NOT EXISTS payments (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 booking_id BIGINT UNSIGNED NOT NULL,
 amount DECIMAL(10,2) NOT NULL,
 payment_method VARCHAR(40) NOT NULL,
 status ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
 transaction_ref VARCHAR(120) UNIQUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_payments_booking FOREIGN KEY(booking_id) REFERENCES bookings(id)
);

CREATE TABLE IF NOT EXISTS reviews (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 event_id BIGINT UNSIGNED NOT NULL,
 rating TINYINT UNSIGNED NOT NULL,
 comment TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT chk_review_rating CHECK(rating BETWEEN 1 AND 5),
 CONSTRAINT fk_reviews_user FOREIGN KEY(user_id) REFERENCES users(id),
 CONSTRAINT fk_reviews_event FOREIGN KEY(event_id) REFERENCES events(id),
 UNIQUE KEY uq_user_event_review(user_id,event_id)
);

CREATE TABLE IF NOT EXISTS notifications (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 title VARCHAR(180) NOT NULL,
 message TEXT NOT NULL,
 is_read BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 CONSTRAINT fk_notifications_user FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS event_attendance (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 booking_id BIGINT UNSIGNED NOT NULL,
 checked_in_at TIMESTAMP NULL,
 checked_in_by BIGINT UNSIGNED NULL,
 UNIQUE KEY uq_attendance_booking(booking_id),
 CONSTRAINT fk_attendance_booking FOREIGN KEY(booking_id) REFERENCES bookings(id),
 CONSTRAINT fk_attendance_admin FOREIGN KEY(checked_in_by) REFERENCES users(id)
);
