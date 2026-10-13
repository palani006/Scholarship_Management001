# Scholarship Management System

A full-stack Scholarship Management System built with **FastAPI** (Backend) and **React + Vite** (Frontend). Admins can post scholarships and review applications. Students can browse scholarships, apply, and track their application status.

## Team Members

| Name        | Roll Number  | Stream |
|-------------|-------------|--------|
| S PALANI    | 23F41A0598  | CSE    |
| PR RAJESH   | 23F41A0577  | CSE    |
| M DHANUSH   | 23F41A0556  | CSE    |

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite, JWT Authentication
- **Frontend:** React 19, Vite, React Router, Axios

## Project Structure

```
scholarship-project/
├── scholarship-api/          # Backend (FastAPI)
│   ├── main.py               # Application entry point
│   ├── database.py           # SQLAlchemy DB config
│   ├── dependencies.py       # Dependency injection
│   ├── models/               # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── scholarship.py
│   │   └── application.py
│   ├── schemas/              # Pydantic validation schemas
│   │   ├── scholarship.py
│   │   └── application.py
│   ├── utils/                # Utilities
│   │   ├── hashing.py        # Password hashing (bcrypt)
│   │   └── jwt.py            # JWT token management
│   ├── routers/              # API route handlers
│   │   ├── auth.py           # Register & Login
│   │   ├── scholarships.py   # CRUD scholarships
│   │   └── applications.py   # Application management
│   └── requirements.txt
│
└── scholarship-app/          # Frontend (React + Vite)
    ├── src/
    │   ├── api/client.js     # Axios HTTP client
    │   ├── components/
    │   │   ├── LoginForm.jsx
    │   │   ├── RegisterForm.jsx
    │   │   ├── Header.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── ScholarshipList.jsx
    │   │   ├── CreateScholarshipPage.jsx
    │   │   ├── EditScholarshipPage.jsx
    │   │   ├── ApplicationList.jsx
    │   │   ├── MyApplications.jsx
    │   │   └── CreateApplicationPage.jsx
    │   ├── App.jsx
    │   └── index.css
    ├── .env
    └── package.json
```

## Getting Started

### Backend Setup

```bash
cd scholarship-api
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd scholarship-app
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## API Endpoints

| Method | URL                  | Auth       | Description              |
|--------|---------------------|------------|--------------------------|
| POST   | /auth/register      | Public     | Register new user        |
| POST   | /auth/login         | Public     | Login, returns JWT token |
| GET    | /scholarships       | User/Admin | List all scholarships    |
| POST   | /scholarships       | Admin      | Post a scholarship       |
| PUT    | /scholarships/{id}  | Admin      | Update scholarship       |
| DELETE | /scholarships/{id}  | Admin      | Delete scholarship       |
| GET    | /applications       | Admin      | View all applications    |
| GET    | /applications/me    | User       | View own applications    |
| POST   | /applications       | User       | Submit an application    |
| PUT    | /applications/{id}  | Admin      | Approve/Reject application |

## Roles & Permissions

### Admin
- Add, Edit, Delete scholarships
- View all applications
- Approve or Reject applications

### User (Student)
- Browse all scholarships
- Submit an application
- View own application status

---
*Python Full Stack + GenAI Training — Kuppam 2026*
