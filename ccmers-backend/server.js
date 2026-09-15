const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load env variables
dotenv.config();

// Initialize express app
const app = express();

// Database Connection
connectDB();

// Core Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'CCMERS Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Campus Crisis Management & Emergency Response System API',
    version: '1.0.0'
  });
});

// Import Routes placeholder (will be attached in subsequent modules)
try {
  app.use('/api/auth', require('./src/routes/authRoutes'));
  app.use('/api/incidents', require('./src/routes/incidentRoutes'));
  app.use('/api/departments', require('./src/routes/departmentRoutes'));
  app.use('/api/analytics', require('./src/routes/analyticsRoutes'));
} catch (err) {
  // Routes will be loaded cleanly as controllers are defined
}

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found - ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[CCMERS Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
