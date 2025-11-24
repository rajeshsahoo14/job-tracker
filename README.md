# 📋 Job Application Tracker

A full-stack MERN application for tracking job applications with real-time notifications.

## 🚀 Live Demo

- **Frontend**: [Sooon]
- **Backend**: [Sooon]

## ✨ Features

- ✅ JWT Authentication (Login/Register)
- ✅ Role-based Access (Applicant & Admin)
- ✅ Add, Edit, Delete Job Applications
- ✅ Status Management (Applied, Interview, Offer, Rejected, Accepted)
- ✅ Filter & Search Jobs
- ✅ Real-time Socket.IO Notifications
- ✅ Email Notifications
- ✅ Responsive Design
- ✅ Form Validation

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS v4, React Router, Socket.IO Client, Axios

**Backend:** Node.js, Express, MongoDB, JWT, Socket.IO, Nodemailer

**Database:** MongoDB

**Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas

## 📁 Project Structure
```
job-tracker/
├── backend/          # Node.js backend
├── frontend/         # React frontend
└── README.md
```

## 🏃‍♂️ Local Setup

### Prerequisites
- Node.js (v14+)
- MongoDB
- Git

### Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job-tracker
JWT_SECRET=your_very_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Job Tracker <noreply@jobtracker.com>
FRONTEND_URL=http://localhost:3000
```
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```
```bash
npm run dev
```

Visit: `http://localhost:3000`

## 👤 Demo Credentials

**Applicant:**
- Email: applicant@demo.com
- Password: password123

**Admin:**
- Email: admin@demo.com
- Password: password123


## 🔗 API Endpoints

### Authentication
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user

### Jobs
- GET `/api/jobs` - Get all jobs
- GET `/api/jobs/:id` - Get single job
- POST `/api/jobs` - Create job
- PUT `/api/jobs/:id` - Update job
- DELETE `/api/jobs/:id` - Delete job
- GET `/api/jobs/stats` - Get statistics

## 👨‍💻 Developer

**Your Name**
- GitHub: (https://github.com/rajeshsahoo14)
- LinkedIn: [Your Profile](https://linkedin.com/in/rajeshsahoo14)
- Email: rajeshsahoo.dev@gmail.com

## 📄 License

MIT License

---

**Built with❤️❤️❤️** 