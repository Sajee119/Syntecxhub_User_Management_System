# Syntecxhub User Management System

Full-stack user management system with:
- Backend API built with Node.js, Express, and MongoDB
- Frontend dashboard built with React + Vite

## Project Structure

- `backend/` - Express API, authentication, user management, email features
- `frontend/` - React admin UI

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB (local instance or Atlas)

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

3. Configure backend environment variables in `backend/.env`.

Typical values include:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

## Run in Development

Start backend:

```bash
cd backend
npm run dev
```

Start frontend (in a separate terminal):

```bash
cd frontend
npm run dev
```

## Production Commands

Backend:

```bash
cd backend
npm start
```

Frontend build:

```bash
cd frontend
npm run build
npm run preview
```

## Notes

- Frontend Vite template README is located in `frontend/README.md`.
- Root `.gitignore` handles workspace-wide ignores for both backend and frontend.
