# Dayflow HRMS Backend 

Robust, modular REST API for **Dayflow – Human Resource Management System**, developed for the **Odoo Hackathon Bangalore**.

---

## 🛠️ Tech Stack

- **Runtime & Language**: Node.js + TypeScript
- **Framework**: Express.js
- **Database ORM**: Prisma ORM (with PostgreSQL ready schema)
- **Security & Auth**: JWT (Access + Refresh tokens), bcryptjs password hashing, Helmet, Express-Rate-Limit, CORS
- **Validation**: Zod schema validation
- **File Uploads**: Multer (profile pictures, KYC/onboarding documents)
- **Email Dispatcher**: Nodemailer (verification emails, instant leave status notifications)

---

## 📁 Modular Directory Architecture

```
backend/
├── src/
│   ├── config/          # Environment variables & system constants
│   ├── controllers/     # HTTP route controllers
│   ├── middleware/      # Auth, RBAC, Validation, Error Handling, File Uploads
│   ├── routes/          # Express route definitions
│   ├── services/        # Core business logic & rule execution
│   ├── types/           # Shared TypeScript interfaces & DTOs
│   ├── utils/           # Response formatter, JWT, password hash, email helpers
│   ├── validators/      # Zod validation schemas
│   └── app.ts           # Express application initialization & middleware pipeline
├── prisma/
│   └── schema.prisma    # PostgreSQL database schema (to be connected in DB phase)
├── .env.example         # Environment template
├── tsconfig.json        # TypeScript compiler configuration
└── package.json
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```

### 3. Run in Development Mode
```bash
npm run dev
```

Server starts at: `http://localhost:5000`  
Health check: `http://localhost:5000/api/health`

---

## 🔑 Pre-Seeded Hackathon Credentials

| Role | Email | Password | Employee ID |
| :--- | :--- | :--- | :--- |
| **Admin / HR** | `admin@dayflow.com` | `Admin@1234` | `ADM-001` |
| **Employee** | `employee@dayflow.com` | `Employee@1234` | `EMP-101` |

---

## 📡 REST API Summary

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new employee/user
- `POST /api/auth/login` - Login with email & password
- `POST /api/auth/verify-email` - Verify email token
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### 2. Employee Management (`/api/employees`)
- `GET /api/employees/me` - Get logged-in employee profile
- `PATCH /api/employees/me` - Update personal profile (phone, address, avatar)
- `POST /api/employees/me/profile-picture` - Upload profile picture
- `GET /api/employees` - (Admin/HR) List all employees
- `GET /api/employees/:id` - (Admin/HR) Get employee details
- `PATCH /api/employees/:id` - (Admin/HR) Update employee job details, department, role
- `POST /api/employees/:id/documents` - (Admin/HR) Upload employee documents

### 3. Attendance (`/api/attendance`)
- `POST /api/attendance/check-in` - Daily check-in (marks PRESENT)
- `POST /api/attendance/check-out` - Daily check-out (calculates work hours, HALF_DAY if < 7.5h)
- `GET /api/attendance/today` - Get status for today
- `GET /api/attendance/me` - Get attendance history for logged-in employee
- `GET /api/attendance/weekly` - Weekly attendance breakdown
- `GET /api/attendance` - (Admin/HR) View all employee attendance records

### 4. Leave Management (`/api/leaves`)
- `POST /api/leaves` - Apply for leave (PAID, SICK, UNPAID)
- `GET /api/leaves/me` - View own leave applications
- `GET /api/leaves` - (Admin/HR) View all leave applications
- `PATCH /api/leaves/:id/approve` - (Admin/HR) Approve leave + auto-sync attendance
- `PATCH /api/leaves/:id/reject` - (Admin/HR) Reject leave with comments

### 5. Payroll (`/api/payroll`)
- `GET /api/payroll/me/salary-structure` - (Employee) View own salary structure (read-only)
- `GET /api/payroll/me/slips` - (Employee) View own salary slips
- `GET /api/payroll/slips` - (Admin/HR) View all employee salary slips
- `POST /api/payroll/generate-slip` - (Admin/HR) Generate monthly salary slip
- `GET /api/payroll/employee/:id/salary-structure` - (Admin/HR) View employee salary
- `PATCH /api/payroll/employee/:id/salary-structure` - (Admin/HR) Update employee salary structure

### 6. Notifications (`/api/notifications`)
- `GET /api/notifications/me` - Get in-app alerts
- `PATCH /api/notifications/:id/read` - Mark single notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read

### 7. Reports & Analytics (`/api/reports`)
- `GET /api/reports/attendance` - (Admin/HR) Real-time attendance rate & daily metrics
- `GET /api/reports/leaves` - (Admin/HR) Pending/Approved/Rejected leave breakdowns
- `GET /api/reports/employees` - (Admin/HR) Department & role distribution
- `GET /api/reports/payroll` - (Admin/HR) Total monthly payroll payout & averages
