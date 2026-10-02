# 🚀 JobConnect — Advanced Job Portal

JobConnect is a production-ready, full-stack Job Portal platform built with **Django REST Framework** on the backend and **React + Tailwind CSS** on the frontend.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Form Management:** React Hook Form + Zod validation
- **Icons:** React Icons & Lucide React

### Backend
- **Framework:** Python / Django 5 / Django REST Framework
- **Authentication:** JWT (djangorestframework-simplejwt)
- **API Docs:** Swagger / OpenAPI (drf-spectacular)
- **Database:** PostgreSQL (production) / SQLite (development)
- **Storage:** Local Media / Cloudinary / AWS S3
- **Email:** Django Core Mail (Console / SMTP)

---

## 🌿 Git Branch Strategy

- **`main`**: Production-ready stable branch.
- **`develop`**: Main integration branch for active features.
- **`feature/*`**: Feature branches isolated per milestone/task.

---

## 📁 Repository Structure

```
real-time-Job-portal/
├── backend/
│   ├── config/              # Django settings & root URLs
│   ├── users/               # Custom User, Auth, Candidate/Recruiter profiles
│   ├── jobs/                # Job postings, categories, filtering
│   ├── companies/           # Company profiles & verification
│   ├── applications/        # Applications & candidate tracking
│   ├── interviews/          # Interview scheduling & management
│   ├── notifications/       # Real-time / In-app notifications
│   ├── reviews/             # Company reviews & ratings
│   ├── reports/             # Job report & fraud moderation
│   ├── requirements.txt
│   ├── manage.py
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
├── .gitignore
└── README.md
```
