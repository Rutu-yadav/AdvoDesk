# AdvoDesk - Legal Case Management System (Two-Role Architecture)

A comprehensive legal case management system built with Spring Boot and React, supporting **Admin** and **Advocate** roles with a secure verification workflow.

---

## 🎯 System Overview

AdvoDesk is designed for law firms and legal professionals to manage cases, clients, hearings, and documents efficiently. The system implements a **two-role architecture**:

- **Admin**: Full system access with advocate verification capabilities
- **Advocate**: Registered lawyers who can manage cases after admin approval

---

## ✨ Key Features

### Authentication & Security
- ✅ JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Secure password encryption with BCrypt
- ✅ Status-based login for advocates (PENDING/APPROVED/REJECTED)

### Advocate Verification Workflow
- ✅ Advocate registration with Bar Council enrollment number
- ✅ Document upload during registration (PDF verification documents)
- ✅ Admin approval/rejection system
- ✅ Login blocked until admin approval
- ✅ Rejection reason tracking

### Case Management
- ✅ Create and track legal cases (Civil/Criminal)
- ✅ Case status tracking (Open/Closed/Won/Lost)
- ✅ Client association
- ✅ Court and filing date management

### Hearing Management
- ✅ Schedule court hearings
- ✅ Hearing status tracking
- ✅ Judge and courtroom information
- ✅ Notes and updates

### Document Management
- ✅ Upload case-related documents
- ✅ Download documents
- ✅ Document categorization
- ✅ File size and type validation

### Dashboard & Analytics
- ✅ Real-time statistics
- ✅ Case overview
- ✅ Upcoming hearings
- ✅ Quick actions

---

## 🏗️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 17
- **Security**: Spring Security + JWT
- **Database**: MySQL 8.0+
- **ORM**: Spring Data JPA (Hibernate)
- **Build Tool**: Maven 3.6+

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: React Icons

---

## 📋 Prerequisites

Before running the application, ensure you have:

- ✅ Java 17 or higher
- ✅ Maven 3.6+
- ✅ MySQL 8.0+
- ✅ Node.js 18+ and npm
- ✅ Git (optional)

---

## 🚀 Quick Start Guide

### 1. Database Setup

#### Create Database
```sql
CREATE DATABASE advo_desk;
USE advo_desk;
```

#### Run Schema Script
```bash
mysql -u root -p advo_desk < database/schema.sql
```

#### Insert Admin User
```bash
mysql -u root -p advo_desk < database/insert_admin.sql
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

---

### 2. Backend Setup

#### Configure Database Connection

Edit `advo-desk-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/advo_desk?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

#### Build and Run

```bash
cd advo-desk-backend
mvn clean install
mvn spring-boot:run
```

**Backend runs on:** `http://localhost:8080`

---

### 3. Frontend Setup

#### Install Dependencies

```bash
cd advo-desk-frontend
npm install
```

#### Run Development Server

```bash
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## 🔐 Advocate Verification Workflow

### Step 1: Advocate Registration

1. Navigate to `http://localhost:5173/register`
2. Fill in the registration form:
   - Full Name
   - Username
   - Email
   - Phone
   - Password
   - **Role**: Select "Advocate"
   - **Bar Council Enrollment Number** (Format: STATE/NUMBER/YEAR, e.g., MAH/5678/2024)
   - **Upload Verification Document** (PDF only, max 5MB)
3. Submit registration
4. **Status**: Account created with `PENDING` status

### Step 2: Admin Verification

1. Admin logs in at `http://localhost:5173/login`
2. Navigate to **Admin Dashboard** → **Pending Verifications** (`/admin/verifications`)
3. View advocate details and uploaded documents
4. **Approve** or **Reject** the advocate
   - If rejecting, provide a reason

### Step 3: Advocate Login

**If APPROVED:**
- Advocate can login successfully
- Redirected to Advocate Dashboard
- Full access to case management features

**If PENDING:**
- Login blocked
- Error: "Your account is pending verification by admin. Please wait for approval."

**If REJECTED:**
- Login blocked
- Error: "Your account verification was rejected. Reason: [rejection reason]"

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user (Admin/Advocate) | Public |
| POST | `/api/auth/login` | Login with username/password | Public |

### Admin Verification
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/verification/pending` | Get pending advocates | Admin |
| GET | `/api/admin/verification/history` | Get all advocates | Admin |
| POST | `/api/admin/verification/approve/{id}` | Approve advocate | Admin |
| POST | `/api/admin/verification/reject/{id}` | Reject advocate | Admin |
| GET | `/api/admin/verification/pending/count` | Get pending count | Admin |

### Case Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cases` | Get all cases | Admin, Advocate |
| POST | `/api/cases` | Create new case | Admin, Advocate |
| PUT | `/api/cases/{id}` | Update case | Admin, Advocate |
| DELETE | `/api/cases/{id}` | Delete case | Admin, Advocate |

### Client Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/clients` | Get all clients | Admin, Advocate |
| POST | `/api/clients` | Create new client | Admin, Advocate |
| PUT | `/api/clients/{id}` | Update client | Admin, Advocate |
| DELETE | `/api/clients/{id}` | Delete client | Admin, Advocate |

### Hearing Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/hearings` | Get all hearings | Admin, Advocate |
| GET | `/api/hearings/upcoming` | Get upcoming hearings | Admin, Advocate |
| POST | `/api/hearings` | Create hearing | Admin, Advocate |
| PUT | `/api/hearings/{id}` | Update hearing | Admin, Advocate |
| DELETE | `/api/hearings/{id}` | Delete hearing | Admin, Advocate |

### Document Management
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/documents/case/{caseId}` | Get case documents | Admin, Advocate |
| POST | `/api/documents` | Upload document | Admin, Advocate |
| GET | `/api/documents/{id}/download` | Download document | Admin, Advocate |
| DELETE | `/api/documents/{id}` | Delete document | Admin, Advocate |

### Dashboard
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Admin, Advocate |

---

## 📁 Project Structure

### Backend Structure
```
advo-desk-backend/
├── src/main/java/com/advo/desk/
│   ├── AdvoDeskApplication.java          # Main application entry point
│   ├── controller/                       # REST API controllers
│   │   ├── AuthController.java           # Authentication endpoints
│   │   ├── VerificationController.java   # Admin verification endpoints
│   │   ├── CaseController.java
│   │   ├── ClientController.java
│   │   ├── HearingController.java
│   │   └── DocumentController.java
│   ├── service/                          # Business logic layer
│   │   ├── AuthService.java              # Authentication & registration
│   │   ├── FileUploadService.java        # Document upload handling
│   │   └── ...
│   ├── repository/                       # Database access layer
│   │   ├── AdminRepository.java
│   │   ├── AdvocateRepository.java
│   │   └── ...
│   ├── entity/                           # JPA entities
│   │   ├── Admin.java                    # Admin user entity
│   │   ├── Advocate.java                 # Advocate entity with verification
│   │   ├── User.java                     # Base user entity
│   │   ├── Case.java
│   │   ├── Client.java                   # Client data (not user role)
│   │   ├── Hearing.java
│   │   └── Document.java
│   ├── dto/                              # Data Transfer Objects
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   └── RegisterRequest.java
│   ├── security/                         # Security configuration
│   │   ├── SecurityConfig.java
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserDetailsServiceImpl.java
│   ├── model/                            # Enums and models
│   │   └── VerificationStatus.java       # PENDING, APPROVED, REJECTED
│   └── exception/                        # Exception handling
│       ├── GlobalExceptionHandler.java
│       └── ...
├── src/main/resources/
│   └── application.properties            # Application configuration
├── uploads/                              # Uploaded documents storage
└── pom.xml                               # Maven dependencies
```

### Frontend Structure
```
advo-desk-frontend/
├── src/
│   ├── components/                       # Reusable components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/                            # Page components
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdvocateDashboard.jsx
│   │   ├── CaseManagement.jsx
│   │   ├── ClientManagement.jsx
│   │   ├── HearingManagement.jsx
│   │   ├── DocumentManagement.jsx
│   │   └── admin/
│   │       └── PendingVerifications.jsx  # Advocate verification page
│   ├── services/                         # API service layer
│   │   ├── api.js                        # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── caseService.js
│   │   ├── clientService.js
│   │   └── ...
│   ├── context/                          # React Context
│   │   └── AuthContext.jsx               # Authentication context
│   ├── utils/                            # Utility functions
│   │   └── constants.js                  # Application constants
│   ├── App.jsx                           # Main app with routing
│   ├── main.jsx                          # Entry point
│   └── index.css                         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

### Database Structure
```
database/
├── schema.sql                            # Complete database schema
├── insert_admin.sql                      # Pre-insert admin user
├── sample_data.sql                       # Sample data for testing
└── migration_separate_tables.sql         # Migration scripts
```

---

## 🧪 Testing the Application

### Test 1: Admin Login
1. Navigate to `http://localhost:5173/login`
2. Login with: `admin` / `admin123`
3. ✅ Should redirect to Admin Dashboard

### Test 2: Advocate Registration
1. Navigate to `http://localhost:5173/register`
2. Fill form with role "Advocate"
3. Enter enrollment number: `MAH/1234/2024`
4. Upload a PDF document
5. Submit registration
6. ✅ Should show success message about pending verification

### Test 3: Advocate Login (Before Approval)
1. Try to login with newly registered advocate
2. ✅ Should show error: "Your account is pending verification"

### Test 4: Admin Approval
1. Login as admin
2. Navigate to `/admin/verifications`
3. Click "Approve" for pending advocate
4. ✅ Status should change to APPROVED

### Test 5: Advocate Login (After Approval)
1. Login with approved advocate credentials
2. ✅ Should redirect to Advocate Dashboard
3. ✅ Can access case management features

---

## 🛠️ Troubleshooting

### Backend Issues

**Port 8080 already in use:**
```properties
# Change in application.properties
server.port=8081
```

**Database connection error:**
1. Verify MySQL is running: `mysql -u root -p`
2. Check credentials in `application.properties`
3. Ensure database `advo_desk` exists

**JWT token errors:**
- Check `jwt.secret` in `application.properties`
- Ensure token is being sent in Authorization header

### Frontend Issues

**Port 5173 already in use:**
```bash
# Kill the process or change port in vite.config.js
```

**CORS errors:**
- Verify backend `@CrossOrigin` allows `http://localhost:5173`
- Check `SecurityConfig.java` CORS configuration

**API connection errors:**
1. Verify backend is running on port 8080
2. Check `API_BASE_URL` in `constants.js`
3. Check browser console for detailed errors

---

## 🔒 Security Features

- ✅ **Password Encryption**: BCrypt with strength 10
- ✅ **JWT Authentication**: Secure token-based auth
- ✅ **Role-Based Access**: Protected routes and endpoints
- ✅ **Status-Based Login**: Advocates must be approved
- ✅ **CORS Protection**: Configured allowed origins
- ✅ **SQL Injection Prevention**: JPA parameterized queries
- ✅ **File Upload Validation**: Type and size restrictions

---

## 📦 Building for Production

### Backend
```bash
cd advo-desk-backend
mvn clean package
java -jar target/desk-1.0.0.jar
```

### Frontend
```bash
cd advo-desk-frontend
npm run build
# Deploy the 'dist' folder to your web server
```

---

## 🎓 Academic Project Notes

This project is suitable for final-year academic submissions with the following highlights:

✅ **Clean Architecture**: Separation of concerns (Controller-Service-Repository)  
✅ **Security Best Practices**: JWT, BCrypt, RBAC  
✅ **RESTful API Design**: Standard HTTP methods and status codes  
✅ **Database Design**: Normalized schema with proper relationships  
✅ **Modern Tech Stack**: Industry-standard technologies  
✅ **Verification Workflow**: Real-world business logic implementation  
✅ **Responsive UI**: Mobile-friendly design with Tailwind CSS  

---

## 📝 Important Notes

> **Note**: The `Client` entity in the database is for storing client information related to legal cases (name, contact, address). This is different from user authentication roles. The system only supports **Admin** and **Advocate** user roles.

> **Security**: Change the default admin password and JWT secret before deploying to production.

> **File Storage**: Uploaded documents are stored in the `uploads/` directory. For production, consider using cloud storage (AWS S3, Azure Blob, etc.).

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review code comments in source files
3. Check application logs for detailed error messages

---

## 📄 License

This project is created for academic purposes.

---

**Built with ❤️ for Legal Professionals**

🚀 **Happy Coding!**
