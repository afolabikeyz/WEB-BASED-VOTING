# AI SYSTEM GENERATION PROMPT

You are a Senior Full-Stack Software Engineer, Software Architect, Cybersecurity Engineer, UI/UX Designer, DevOps Engineer, Database Engineer, Biometric Authentication Specialist, Blockchain/Audit Systems Expert, and Digital Election Security Consultant.

Design and build a complete production-ready web application titled:

# DESIGN AND IMPLEMENTATION OF A SECURE, TRANSPARENT AND AUDITABLE WEB-BASED VOTING PLATFORM FOR STUDENT UNION GOVERNMENT

## (A CASE STUDY OF ADESEUN OGUNDOYIN POLYTECHNIC, ERUWA)

The system must be enterprise-grade, highly secure, scalable, mobile-responsive, cloud-ready, and suitable as a final-year undergraduate or postgraduate project.

---

# PROJECT OVERVIEW

Develop a secure electronic voting platform that eliminates voter impersonation, proxy voting, electoral fraud, credential sharing, vote manipulation, and result tampering.

The platform must ensure:

* One Student = One Vote
* Secure voter authentication
* Transparent election process
* Real-time election monitoring
* End-to-end vote protection
* Verifiable election results
* Tamper-proof audit trail
* Complete accountability

The system must replace the current AOPE voting platform that relies solely on:

* Matric Number
* Email Address
* Phone Number

which are vulnerable to sharing and abuse.

---

# PRIMARY OBJECTIVES

The system must:

1. Eliminate voter impersonation.
2. Prevent proxy voting.
3. Protect vote confidentiality.
4. Ensure vote integrity.
5. Ensure election transparency.
6. Provide verifiable election results.
7. Generate immutable audit logs.
8. Support independent election verification.
9. Detect suspicious voting activities.
10. Increase student trust in elections.

---

# USER ROLES

## Student Voter

Can:

* Login securely
* Verify identity
* Complete MFA verification
* Complete facial verification
* Cast vote
* Verify vote submission
* View election status
* View voting history
* Receive election notifications

---

## Electoral Officer

Can:

* Create elections
* Manage candidates
* Manage faculties
* Manage departments
* Manage voter lists
* Monitor election activities
* Generate reports
* View audit logs

---

## Election Administrator

Can:

* Manage users
* Configure elections
* Monitor security events
* Manage system settings
* View analytics dashboard
* Verify election integrity
* Publish election results

---

# SECURITY REQUIREMENTS

Implement advanced election security.

---

## Multi-Factor Authentication (MFA)

Authentication requires:

### Stage 1

Student Login

* Matric Number
* Password

### Stage 2

OTP Verification

Send OTP through:

* Email
* SMS

### Stage 3

Facial Recognition Verification

Using:

* Face-api.js
* TensorFlow.js
* AWS Rekognition (optional)

The student's face must match the registered biometric profile.

---

## Device Binding

Implement optional device registration.

Store:

* Device ID
* Browser Fingerprint
* IP Address
* Geolocation

Flag unusual devices.

---

## Session Security

Implement:

* JWT Authentication
* Refresh Tokens
* Secure Cookies
* CSRF Protection
* Session Timeout
* Concurrent Session Detection

---

# ELECTRONIC VOTING MODULE

Election Features:

* Create Election
* Open Election
* Close Election
* Schedule Election
* Candidate Registration
* Candidate Approval
* Faculty-Based Elections
* Department-Based Elections

---

# VOTING ENGINE

Requirements:

* Anonymous voting
* Secure vote submission
* One vote per voter
* Vote encryption
* Vote integrity verification
* Duplicate vote prevention

Voting Process:

1. Student authenticates.
2. Student completes MFA.
3. Student completes facial verification.
4. Voting ballot appears.
5. Student selects candidate.
6. Vote encrypted.
7. Vote stored securely.
8. Audit log generated.
9. Confirmation generated.

---

# CRYPTOGRAPHIC SECURITY

Implement:

* AES-256 Encryption
* RSA Key Exchange
* HTTPS/TLS
* Vote Hashing
* Digital Signatures

Protect:

* Votes
* Authentication Data
* Audit Logs
* Election Results

---

# AUDITABILITY MODULE

Build immutable audit trails.

Log:

* Login events
* OTP verification
* Facial verification
* Vote submission
* Candidate creation
* Election creation
* Result publication
* Admin actions

Fields:

* User
* Action
* Timestamp
* Device
* IP Address
* Browser Fingerprint

Audit logs must be tamper-proof.

---

# TRANSPARENCY MODULE

Provide:

* Public election dashboard
* Total registered voters
* Total votes cast
* Turnout percentage
* Election timeline

Without exposing voter identity.

---

# ANOMALY DETECTION MODULE

Detect:

* Multiple login attempts
* Suspicious IP activity
* Credential sharing
* Rapid voting patterns
* Device switching
* Automated voting attacks

Generate:

* Alerts
* Notifications
* Security reports

---

# DATABASE DESIGN

Generate complete PostgreSQL schema.

Tables:

1. users
2. roles
3. permissions
4. students
5. faculties
6. departments
7. elections
8. positions
9. candidates
10. votes
11. audit_logs
12. notifications
13. otp_verifications
14. facial_profiles
15. device_registrations
16. security_events
17. election_results
18. voter_sessions
19. system_settings

Requirements:

* UUID Primary Keys
* Foreign Keys
* Constraints
* Indexes
* Soft Deletes
* Timestamps

---

# FRONTEND REQUIREMENTS

Technology:

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* ShadCN UI
* Framer Motion
* React Query
* Zustand

---

# UI/UX DESIGN REQUIREMENTS

Create a modern election platform.

Design Style:

* Government-grade security interface
* Professional
* Minimalist
* Accessible
* Mobile-first

Color Scheme:

* AOPE-inspired colors
* Trust-building design
* Security-focused aesthetics

---

# PAGES

Public Pages:

* Homepage
* About Election
* Candidate Profiles
* Election Guidelines
* FAQ
* Contact

Student Pages:

* Login
* MFA Verification
* Facial Verification
* Dashboard
* Voting Page
* Vote Confirmation
* Notifications
* Profile

Election Officer Pages:

* Election Dashboard
* Candidate Management
* Voter Management
* Reports

Admin Pages:

* Security Dashboard
* Election Management
* Audit Logs
* Analytics
* User Management
* System Settings

---

# ANALYTICS DASHBOARD

Display:

* Registered Students
* Active Voters
* Total Votes Cast
* Turnout Rate
* Election Progress
* Faculty Participation
* Department Participation
* Security Events
* Authentication Failures

Charts:

* Bar Charts
* Pie Charts
* Line Charts
* Heat Maps

---

# API REQUIREMENTS

Generate complete REST API documentation.

Authentication:

POST /auth/login
POST /auth/logout
POST /auth/verify-otp
POST /auth/verify-face
POST /auth/refresh-token

Elections:

CRUD Operations

Candidates:

CRUD Operations

Voting:

POST /vote/cast
GET /vote/verify

Audit Logs:

GET /audit

Reports:

GET /reports

Analytics:

GET /analytics/dashboard

---

# SYSTEM ARCHITECTURE

Provide:

* High-Level Architecture Diagram
* Use Case Diagram
* Sequence Diagram
* Activity Diagram
* Database ERD
* Security Architecture Diagram
* Authentication Flow Diagram
* Voting Flow Diagram
* Deployment Architecture

---

# DEVOPS & DEPLOYMENT

Frontend:

* Vercel

Backend:

* Railway / Render

Database:

* PostgreSQL / Supabase

Storage:

* AWS S3

Containerization:

* Docker

CI/CD:

* GitHub Actions

Monitoring:

* Sentry
* Grafana
* Prometheus

---

# TESTING

Generate:

* Unit Tests
* Integration Tests
* Security Tests
* Penetration Testing Plan
* User Acceptance Testing
* Load Testing

---

# FINAL DELIVERABLES

Generate:

1. Complete Folder Structure
2. Full Frontend Source Code
3. Full Backend Source Code
4. PostgreSQL Database Schema
5. API Documentation
6. MFA Authentication Module
7. OTP Verification Module
8. Facial Recognition Module
9. Secure Voting Engine
10. Audit Logging System
11. Analytics Dashboard
12. Docker Configuration
13. Environment Variables
14. Deployment Guide
15. Testing Documentation
16. Security Documentation
17. User Manual
18. Administrator Manual

The solution must be production-ready, secure, transparent, auditable, scalable, responsive, and demonstrate best practices in modern software engineering, cybersecurity, UI/UX design, and electronic voting systems.
