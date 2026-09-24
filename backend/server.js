import dotenv from 'dotenv';

// Load environment variables before any other imports
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/db.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start HTTP server
const server = app.listen(PORT, () => {
  logger.info(`SchoolERP Backend Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`, err);
  process.exit(1);
});

// Handle termination signals
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    logger.info('Server closed. Process terminated.');
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down server...');
  server.close(() => {
    logger.info('Server closed. Process terminated.');
  });
});
