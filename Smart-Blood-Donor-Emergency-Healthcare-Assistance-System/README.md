# Smart Blood Donor & Emergency Healthcare Assistance System (SBDEHAS)

## Project Overview

Smart Blood Donor & Emergency Healthcare Assistance System (SBDEHAS) is a web based healthcare platform developed to assist patients during medical emergencies. The system helps users find blood donors, submit emergency blood requests, and search for hospitals with available facilities.

This project was developed as part of the GTU Societal Internship Program to address challenges faced by patients and healthcare providers in locating blood donors and emergency healthcare resources.

## Features

### User Module

* User Registration and Login
* Profile Management
* Emergency Blood Request Submission
* Request History Tracking

### Blood Donor Module

* Donor Registration
* Blood Group Based Search
* Donor Availability Management
* Contact Information Access

### Hospital Module

* Hospital Registration
* Bed Availability Updates
* Hospital Search Functionality

### Emergency Assistance Module

* Emergency Request Management
* Real Time Request Tracking
* Quick Access to Healthcare Resources

### Admin Module

* Dashboard Analytics
* Donor Management
* Hospital Management
* Emergency Request Monitoring
* User Management

## Technologies Used

### Frontend

* HTML5
* CSS3
* Bootstrap 5
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MySQL

### APIs and Services

* REST API
* Email Notification Service

## Project Structure

```text
Smart-Blood-Donor-Emergency-Healthcare-Assistance-System
│
├── backend
│   ├── routes
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── emailService.js
│
├── css
│   └── style.css
│
├── images
│
├── js
│   └── script.js
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── donor-search.html
├── hospital-search.html
├── emergency-request.html
├── admin-login.html
└── admin-dashboard.html
```

## Installation

### Clone Repository

```bash
git clone https://github.com/nisargchauhan-7/Smart-Blood-Donor-Emergency-Healthcare-Assistance-System.git
```

### Navigate to Backend

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

### Configure Database

1. Create a MySQL database.
2. Import the required tables.
3. Update database credentials in `db.js`.

### Start Server

```bash
node server.js
```

Server runs on:

```text
http://localhost:8000
```

## Future Enhancements

* GPS Based Donor Search
* Real Time Hospital Bed Tracking
* Mobile Application
* SMS Notifications
* Blood Bank Integration
* AI Based Emergency Recommendations

## Screenshots

### Home Page
![Home Page](images/screenshots/Home-Page.png)

### Login Page
![Login Page](images/screenshots/Login-Page.png)

### Registration Page
![Registration Page](images/screenshots/Registration-Page.png)

### Donor Search Page
![Donor Search Page](images/screenshots/Donor-Search-Page.png)

### Hospital Bed Availability Page
![Hospital Bed Availability Page](images/screenshots/Hospital-Bed-Availability-Page.png)

### Emergency Request Page
![Emergency Request Page](images/screenshots/Emergency-Request-Page.png)

### Admin Dashboard
![Admin Dashboard](images/screenshots/Admin-Dashboard-Page.png)

## Academic Information

**Project Title:** Smart Blood Donor & Emergency Healthcare Assistance System (SBDEHAS)

**Program:** GTU Societal Internship

**Semester:** 5

**Branch:** Computer Science and Design (CSD).

**Institute:** Sardar Valabhbhai Patel Institute of Technology, Vasad.

## License

This project is developed for educational and academic purposes.
