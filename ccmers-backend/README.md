# CCMERS Backend – Campus Crisis Management & Emergency Response System API

A robust Node.js, Express, and MongoDB RESTful backend API powering the Campus Crisis Management & Emergency Response System (CCMERS).

---

## 🚀 System Features

- **JWT-Based Authentication & Authorization**: Role-Based Access Control (RBAC) supporting `student`, `response`, and `admin` roles.
- **Incident Lifecycle Management**: Full CRUD for incident reporting, department assignment, severity escalation, status updates, and resolution logging.
- **Department Administration**: Management of crisis response departments (Security, Medical, Facilities, IT Support, EHS).
- **Analytics & Reporting**: MongoDB aggregation engine computing category breakdowns, severity distribution, status metrics, and average resolution times.
- **File Attachment Support**: Multer file upload engine for incident evidence images and document attachments.
- **Resilient Fallback Design**: Works seamlessly with live MongoDB or gracefully falls back to in-memory datasets during offline or quick-demo executions.

---

## 📁 Directory Structure

```text
ccmers-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection configuration
│   ├── controllers/
│   │   ├── analyticsController.js # Analytics aggregation metrics
│   │   ├── authController.js      # User registration, login, JWT issuance
│   │   ├── departmentController.js # Department management
│   │   └── incidentController.js  # Incident creation, status update, assignment
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification & role authorization
│   │   ├── errorMiddleware.js     # Centralized error handler
│   │   └── uploadMiddleware.js    # Multer image/document upload middleware
│   ├── models/
│   │   ├── Department.js          # Mongoose Department Schema
│   │   ├── Incident.js            # Mongoose Incident Schema
│   │   └── User.js                # Mongoose User Schema (Bcrypt password hashing)
│   ├── routes/
│   │   ├── analyticsRoutes.js     # Analytics endpoints
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── departmentRoutes.js    # Department endpoints
│   │   └── incidentRoutes.js      # Incident endpoints
│   └── utils/
│       └── seedData.js            # Database auto-seeding script
├── uploads/                       # Static uploaded file storage
├── CCMERS_Postman_Collection.json # Importable Postman API test collection
├── scratch/
│   └── test_api.cjs              # Automated API verification test runner
├── .env                           # Environment variables configuration
├── .gitignore                     # Git exclusion rules
├── package.json                   # Project dependencies and script runner
└── server.js                      # Main Express application entry point
```

---

## 🛠️ Environment Variables (.env)

Create or edit `.env` in the `ccmers-backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ccmers
JWT_SECRET=ccmers_super_secret_jwt_key_2026
NODE_ENV=development
```

---

## ⚙️ Installation & Running

### 1. Install Dependencies
```bash
cd ccmers-backend
npm install
```

### 2. Seed Database (Optional)
Populate MongoDB with default departments, demo users, and initial incidents:
```bash
npm run seed
```

### 3. Start Development Server
```bash
npm run dev
```
The API server will listen on `http://localhost:5000`.

---

## 🧪 Testing the API

### Automated End-to-End Test Suite
Run the built-in automated verification script:
```bash
node scratch/test_api.cjs
```

### Postman Integration
Import `CCMERS_Postman_Collection.json` into Postman to test all API endpoints with pre-configured request payloads.

---

## 📌 API Endpoint Reference

### Health Check
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Basic server check | Public |
| `GET` | `/api/health` | System health status | Public |

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login user & issue JWT | Public |
| `GET` | `/api/auth/me` | Fetch current user profile | Private |

### Incidents (`/api/incidents`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/incidents` | Report a new incident | Student / Admin |
| `GET` | `/api/incidents` | Fetch all incidents | Admin |
| `GET` | `/api/incidents/my` | Fetch student's own incidents | Student |
| `GET` | `/api/incidents/department` | Fetch department assigned incidents | Response / Admin |
| `GET` | `/api/incidents/:id` | Get single incident details | Private |
| `PATCH` | `/api/incidents/:id/status` | Update status & resolution remarks | Response / Admin |
| `PATCH` | `/api/incidents/:id/assign` | Assign incident to dept & severity | Admin |

### Departments (`/api/departments`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/departments` | List all departments | Private |
| `GET` | `/api/departments/:id` | Get single department details | Private |
| `POST` | `/api/departments` | Create new department | Admin |
| `PUT` | `/api/departments/:id` | Update department details | Admin |
| `DELETE` | `/api/departments/:id` | Delete department | Admin |

### Analytics (`/api/analytics`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics` | Aggregate crisis metrics & stats | Admin |
