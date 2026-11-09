# Eventra — Event Management System

A responsive React + Express + MySQL starter project for discovering events, registering attendees, publishing events as organizers, and creating demo ticket bookings.

## Features included
- Responsive event discovery landing page with event photography and category filters.
- Event detail and ticket quantity selection.
- Attendee registration and login with bcrypt password hashing and JWT.
- Organizer/admin event publishing endpoint and dashboard form.
- MySQL schema for users, events, bookings, payments, reviews, notifications and attendance.
- Booking transaction locks the event row and updates sold ticket count.
- Demo payment record (no real money is charged).

## Requirements
- Node.js 18+
- MySQL 8+
- npm

## 1. Database setup
Run `database/schema.sql` in MySQL Workbench or the MySQL command line.

## 2. Backend setup
```bash
cd backend
npm install
```
Copy `.env.example` to `.env`, then set your MySQL password and a long random `JWT_SECRET`.
```bash
npm run dev
```
API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## 3. Create an organizer account
Register normally through the app. New registrations are attendees. To enable event creation for your account, run this SQL after registering:
```sql
USE event_management;
UPDATE users SET role='organizer' WHERE email='your-email@example.com';
```
Sign out and sign in again so the new role is included in the JWT.

## 4. Frontend setup
In another terminal:
```bash
cd frontend
npm install
```
Copy `.env.example` to `.env` (the default API URL is already localhost).
```bash
npm run dev
```
Open `http://localhost:5173`.

## Demo notes
- The sample event cards are fallback display data. Once the backend returns published database events, those are displayed instead.
- Booking creates a confirmed booking and a `demo` payment record. It is a demonstration flow, not a real payment gateway.
- Event banner image URL can be supplied in the organizer form. The starter uses remote Unsplash photography for sample visuals.
- Image URLs are stored in MySQL. This starter does not yet include local file upload; add a cloud image provider or a secure upload service before production.
- Admin analytics, QR ticket PDFs, email delivery and full moderation screens are extension points for the next development phase.

## Important security notes
- Keep `.env` private and never commit it.
- Use HTTPS and a strong JWT secret in deployment.
- Add rate limiting, CSRF strategy where applicable, upload validation, payment provider verification, and audit logging before production.
