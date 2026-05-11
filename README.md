# AI-Powered Health Tracker & Nutrition Assistant

A complete production-ready full-stack web application designed to help users track calories, meals, workouts, water intake, and sleep, while providing AI-powered health recommendations via the Gemini API.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: JWT, bcrypt
- **AI Integration**: Gemini API (@google/genai)
- **DevOps**: Docker, GitHub Actions

## Setup Instructions

### Environment Variables
1. **Backend (`server/.env`)**:
   Create a `.env` file in the `server` directory with the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
2. **Frontend (`client/.env`)**:
   Create a `.env` file in the `client` directory (if you change backend URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running Locally without Docker
1. **Backend**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Running with Docker
Ensure Docker Desktop is running.
```bash
docker-compose up --build
```
Access the application at `http://localhost:5173`.

## Features
- **Authentication**: Secure login/registration.
- **Dashboard**: High-level summary of daily health metrics.
- **Tracking Modules**: Detailed tracking for Meals, Workouts, Water, and Sleep.
- **AI Suggestions**: Personalized recommendations based on tracked data.
- **Progressive Web App**: Offline fallback and installable.

## Architecture
- `client/`: React frontend.
- `server/`: Express backend.
