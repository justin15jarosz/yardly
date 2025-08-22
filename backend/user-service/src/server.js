import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import db from "./config/database.js";
import { createTopics, connectProducer, disconnect } from "./config/kafka.js";
import userRoutes from "./routes/public/users.js";
import internalRoutes from "./routes/internal/user.internal.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const extractUserFromHeaders = (req, res, next) => {
  req.gatewayUser = {
    id: req.headers['x-user-id'],
    email: req.headers['x-user-email'],
    role: req.headers['x-user-role'],
    permissions: JSON.parse(req.headers['x-user-permissions'] || '[]')
  };
  next();
};

// Public Routes
app.use("/api/users", userRoutes);

// Internal Routes
app.use('/internal', internalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    service: "user-service",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Database initialization
db.initTables()
  .then(() => console.log("Database initialized"))
  .catch((err) => console.error("Database initialization error:", err));

// Initialize Kafka and start server
async function startServer() {
  try {
    console.log("🚀 Starting User Service...");

    // Initialize Kafka
    await createTopics();
    await connectProducer();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ User Service running on http://localhost:${PORT}`);
      console.log(`📋 Available endpoints:
        POST /api/users/register/initialize - Register new user
        GET /health - Health check`);
    });
  } catch (error) {
    console.error("❌ Failed to start User Service:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down User Service...");
  await disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down User Service...");
  await disconnect();
  process.exit(0);
});

startServer();
