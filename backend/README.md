# Backend (User Management API)

Express + MongoDB backend for the Syntecxhub User Management System.

## Features

- JWT-based authentication (access + refresh token flow)
- Protected user management routes
- Default admin seeding from environment variables
- User email sending endpoint support
- Health check endpoint with DB status

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JSON Web Token
- bcryptjs
- express-validator
- Nodemailer

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in this folder.

Recommended variables:

- `PORT=5000`
- `MONGO_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_access_token_secret`
- `JWT_REFRESH_SECRET=your_refresh_token_secret`
- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=secure_password`
- `ADMIN_NAME=Admin User`
- `SMTP_HOST=your_smtp_host`
- `SMTP_PORT=587`
- `SMTP_USER=your_smtp_user`
- `SMTP_PASS=your_smtp_password`

Run in development:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

## API Base URL

- `http://localhost:5000/api`

## Main Endpoints

Health:

- `GET /api/health`

Authentication:

- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`
- `GET /api/auth/profile` (protected)

Users (protected):

- `GET /api/users`
- `GET /api/users/stats`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `POST /api/users/:id/send-mail`

## Notes

- All `/api/users/*` routes require a valid access token.
- Server seeds/updates the default admin user at startup when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are provided.
