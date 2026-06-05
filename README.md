# VaCATion - Luxury Cat Boarding System

## Project Overview
VaCATion is a full-stack web application for booking luxury cat boarding. Cat owners can browse suites, create cat profiles, make bookings, and manage reservations.

## Features
- User registration and login (JWT authentication)
- Browse luxury cat suites with filters and sorting
- Create, edit, delete cat profiles (Full CRUD)
- Book suites with real-time price calculation
- View and cancel bookings with status tracking
- Responsive design (mobile, tablet, desktop)
- Contact form for inquiries

## Technology Stack
- Frontend: Vue.js 3, Vue Router, Bootstrap 5, Axios, Google Material Icons
- Backend: Node.js, Express.js, JWT, Bcrypt
- Database: MySQL, phpMyAdmin

## Pages (10 total)
- Home (/) - Landing page
- Rooms (/rooms) - Browse all suites
- Room Detail (/room/:id) - Suite details
- Booking (/booking/:roomId) - Make a booking
- My Cats (/my-cats) - Manage cat profiles
- My Bookings (/my-bookings) - View bookings
- Booking Detail (/booking-detail/:id) - Booking details
- Login (/login) - Sign in
- Register (/register) - Create account
- Contact (/contact) - Contact form

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- XAMPP (for MySQL)

### Step 1: Database Setup
1. Open XAMPP Control Panel
2. Start MySQL
3. Go to http://localhost/phpmyadmin
4. Create a new database named: vacatation
5. Click on the SQL tab
6. Copy and paste the contents of database/schema.sql
7. Click "Go" to run the SQL

### Step 2: Backend Setup
Open a terminal and run these commands one by one:
- cd backend
- npm install
- node server.js

The backend will run on: http://localhost:5000

### Step 3: Frontend Setup
Open a NEW terminal and run these commands:
- npm install
- npm run dev

The frontend will run on: http://localhost:5173

### Step 4: Access the Application
Open your browser and go to: http://localhost:5173

## Login Credentials
You can either:
- Register a new account, OR
- Use test account:
  - Email: testava@gmail.com
  - Password: passwordava
