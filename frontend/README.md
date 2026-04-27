# Frontend (Admin Dashboard)

React + Vite frontend for the Syntecxhub User Management System.

## Features

- Admin login and authenticated routes
- User listing and management actions
- Token-based authentication with automatic refresh flow
- Mail action support from user management UI

## Tech Stack

- React 19
- Vite 8
- React Router DOM
- Axios
- React Toastify

## Project Structure

- `src/pages/` - page-level screens (`Login`, `Dashboard`)
- `src/components/` - reusable UI components and modals
- `src/context/` - auth state management
- `src/services/api.js` - API client, auth header handling, token refresh

## Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

By default, Vite serves the app at `http://localhost:5173`.

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Backend API Dependency

The frontend API client currently points to:

- `http://localhost:5000/api`

Make sure the backend server is running before using the dashboard.

## Authentication Notes

- Access token is attached to requests through an Axios interceptor.
- On `401`, frontend attempts to refresh using `/api/auth/refresh-token`.
- If refresh fails, tokens are cleared and the app redirects to `/login`.
