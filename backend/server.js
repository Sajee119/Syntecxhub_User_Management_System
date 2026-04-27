const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const HEALTH_CHECK_INTERVAL_MS = 5 * 60 * 1000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  const payload = {
    status: dbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: dbConnected ? 'connected' : 'disconnected'
  };

  res.status(dbConnected ? 200 : 503).json(payload);
});

// MongoDB Connection
const seedDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn('⚠️ ADMIN_EMAIL or ADMIN_PASSWORD is missing from .env');
    return;
  }

  const adminData = {
    name: process.env.ADMIN_NAME || 'Admin User',
    email: adminEmail,
    password: adminPassword,
    role: 'Admin',
    status: 'Active'
  };

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    existingAdmin.name = adminData.name;
    existingAdmin.password = adminData.password;
    existingAdmin.role = adminData.role;
    existingAdmin.status = adminData.status;
    await existingAdmin.save();
    return;
  }

  await User.create(adminData);
};

const runPeriodicHealthCheck = async (port) => {
  try {
    const response = await fetch(`http://localhost:${port}/api/health`);
    if (!response.ok) {
      console.warn(`⚠️ Health check failed with status ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log(`✅ Health check (${new Date().toLocaleTimeString()}): ${data.status}`);
  } catch (error) {
    console.error(`❌ Health check error: ${error.message}`);
  }
};

const startServer = async () => {
  await connectDB();
  await seedDefaultAdmin();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API URL: http://localhost:${PORT}/api`);
      console.log(`🔒 Default admin login: ${process.env.ADMIN_EMAIL || 'not configured'}`);
      runPeriodicHealthCheck(PORT);
      setInterval(() => {
        runPeriodicHealthCheck(PORT);
      }, HEALTH_CHECK_INTERVAL_MS);
  });
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

startServer();