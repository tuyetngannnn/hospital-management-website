
# Hospital Management System

This is a web application for managing hospital operations such as appointment scheduling, doctor management, revenue tracking, and more.

## 📁 Project Structure

```
project-root/
│
├── backend/                # Backend logic
│   ├── config/             # Environment config and settings
│   ├── controller/         # Route logic controllers
│   ├── database/           # Database connection logic
│   ├── email/              # Email service abstraction
│   ├── mailtrap/           # Mailtrap templates and config for testing emails
│   ├── middlewares/        # Middleware functions: auth, error handling
│   ├── models/             # Mongoose or schema models
│   ├── router/             # All route definitions
│   ├── utils/              # Utility functions (helper methods)
│   ├── app.js              # Express app config
│   ├── server.js           # Entry point to start server
│   └── passport.js         # Passport.js config for authentication
│
├── frontend/               # Frontend client (ReactJs) 
├── dashboard/              # Admin
│
├── package.json
└── .env
```

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hospital-management.git
cd hospital-management
```

### 2. Install dependencies

Each environment (backend, frontend, dashboard) needs its own dependencies installed.

#### 📦 Install backend dependencies

```bash
cd backend
npm install
```

#### 📦 Install frontend dependencies

```bash
cd ../frontend
npm install
```

#### 📦 Install dashboard dependencies

```bash
cd ../dashboard
npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend/` folder with the necessary environment variables, for example:

```env
PORT=4000
MONGO_URI=mongodb+srv://6bagshospital:123456bag@managehospital.juraj.mongodb.net/?retryWrites=true&w=majority&appName=ManageHospital
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
DOCTOR_URL=http://localhost:5175
JWT_SECRET_KEY=7be942fce810e436ac01da8fcd8590b3183ecca3f55636f926d74b277837f2ae3c4b38f791e1292a8b280d45f66ce27a75bddc14b1e952f123013a50747fa499
JWT_EXPIRES=1d
COOKIE_EXPIRE=2
CLOUDINARY_CLOUD_NAME=dt1g4rxgw
CLOUDINARY_API_KEY=693597867127457
CLOUDINARY_API_SECRET=l6nSZYalHYMHd4krB0TT8YqXX5g
GOOGLE_CLIENT_ID=1000329794325-0vufthrbqpmpdad48i3ufe7nal3vvedj.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_CALLBACK_URL=/api/v1/user/google/callback
SESSION_SECRET=supersecretstring123!@#
MAILTRAP_TOKEN =ece6c3d9a4ee72de7631710bac6325c2
MAILTRAP_ENDPOINT=https://send.api.mailtrap.io/
MAILTRAP_INBOX_ID=3269811

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=6bagshospital@gmail.com
SMTP_PASS=alns tynx lplp otua
```

> You should configure this file according to your deployment and local environment.

## 🏃‍♂️ Run the Project

To run the entire application with all three parts in development mode:

### ✅ Run Backend

```bash
cd backend
npm run dev
```

> Runs with `nodemon` using the entry file `server.js`.

### ✅ Run Frontend

```bash
cd frontend
npm run dev
```

### ✅ Run Dashboard

```bash
cd dashboard
npm run dev
```


## 📚 Technologies Used

- **Backend:** Node.js, Express.js,MongoDB, JWT, Passport
- **Email:** Mailtrap
- **Frontend:** React.js
- **Dashboard:** Admin template

---

## 📬 Contact

For feedback or issues, please contact: [tuyetngan3454@gmail.com]
