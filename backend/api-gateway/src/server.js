import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import gatewayRouter from './routes/gateway.router.js';
import { defaultRateLimit } from './middleware/rate.limiting.js';
import { healthCheck } from './middleware/health.check.js';

import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(defaultRateLimit);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', healthCheck);

// API Gateway routes
app.use('/', gatewayRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Gateway is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;

  res.status(err.status || 500).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
      console.error('request:', req);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

async function startServer() {
  try {
    console.log("🚀 Starting Api Gateway...");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Api Gateway running on http://localhost:${PORT}`);
      console.log('Available routes:');
      console.log('- GET  /health - Health check');
      console.log('- POST /api/auth/login - User login');
      console.log('- GET  /api/users - List users (auth required)');
    });
  } catch (error) {
    console.error("❌ Failed to start Api Gateway:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down Api Gateway...");
  await disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down Api Gateway...");
  await disconnect();
  process.exit(0);
});

startServer();