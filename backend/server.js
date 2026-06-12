const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const logRoutes = require('./routes/log.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const auditRoutes = require('./routes/audit.routes');

// Import middleware
const { errorHandler } = require('./middleware/error.middleware');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: process.env.APP_NAME,
    company: process.env.COMPANY_NAME
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: `Welcome to ${process.env.APP_NAME}`,
    version: '1.0.0',
    company: process.env.COMPANY_NAME,
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      logs: '/api/logs',
      dashboard: '/api/dashboard'
    }
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` ${process.env.APP_NAME} Backend Server Running`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`Developed by: ${process.env.COMPANY_NAME}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});