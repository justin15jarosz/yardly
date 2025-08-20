import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimiter from './middlewares/rate.limiter.js';
import authRoutes from './routes/public/auth.routes.js';
import registrationRoutes from './routes/public/user.registration.routes.js';
import db from "./config/database.js";
import { initRedis } from "./config/cache.manager.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting on auth endpoints
app.use('/api/auth', rateLimiter);
app.use('/api/users', rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', registrationRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    service: "auth-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Database initialization
db.initTables()
  .then(() => console.log("Database initialized"))
  .catch((err) => console.error("Database initialization error:", err));

// Start server
async function startServer() {
  try {
    console.log("🚀 Starting Auth Service...");

    // Initialize cache manager
    await initRedis();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ Auth Service running on http://localhost:${PORT}`);
      console.log(`📋 Available endpoints:
        POST /api/users/register/finalize
        POST /api/auth/login
        POST /api/auth/refresh
        POST /api/auth/logout
        POST /api/auth/request-password-reset
        POST /api/auth/reset-password`);
    });
  } catch (error) {
    console.error("❌ Failed to start Auth Service:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down Auth Service...");
  await disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down Auth Service...");
  await disconnect();
  process.exit(0);
});

startServer();
