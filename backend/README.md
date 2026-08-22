# Dayflow HRMS — Backend

> Backend REST API for **Dayflow – Human Resource Management System**.

Dayflow HRMS Backend provides a modular and secure REST API for employee management, authentication, attendance, leave management, payroll, notifications, and HR analytics.

---

## 🚀 Features

- 🔐 JWT-based authentication with access and refresh tokens
- 👥 Role-based access control for Admin/HR and Employees
- 👤 Employee profile and employee management
- 🕐 Attendance check-in/check-out and attendance history
- 🏖️ Leave application, approval, and rejection
- 💰 Salary structure and salary slip management
- 🔔 In-app notifications
- 📊 HR reports and analytics
- 📁 Profile picture and employee document uploads
- 📧 Email verification and leave-status notifications
- 🛡️ Security middleware with Helmet, CORS, and rate limiting
- ✅ Request validation using Zod
- 🗄️ PostgreSQL database with Prisma ORM

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| TypeScript | Programming language |
| Express.js | REST API framework |
| PostgreSQL | Database |
| Prisma ORM | Database access and migrations |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Zod | Request validation |
| Multer | File uploads |
| Nodemailer | Email services |
| Helmet | HTTP security |
| Express Rate Limit | API rate limiting |
| CORS | Cross-origin request handling |

---

## 📁 Project Structure

```text
backend/
│
├── src/
│   ├── config/          # Environment variables and system configuration
│   ├── controllers/     # HTTP request controllers
│   ├── middleware/      # Authentication, RBAC, validation, errors, uploads
│   ├── routes/          # Express API routes
│   ├── services/        # Business logic
│   ├── types/           # TypeScript interfaces and DTOs
│   ├── utils/           # JWT, password, email and response utilities
│   ├── validators/      # Zod validation schemas
│   └── app.ts           # Express application entry point
│
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
│
├── uploads/             # Uploaded files
├── .env.example         # Environment variable template
├── nodemon.json         # Development configuration
├── package.json
├── tsconfig.json
└── README.md
