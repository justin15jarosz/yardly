import dotenv from "dotenv";
import express from "express";
import nodemailer from "nodemailer";
import { connectConsumer, disconnect } from "./config/kafka.js";
import { consumeMessages } from "./util/consumeMessage.js";

const app = express();
const PORT = 3002;
dotenv.config();

// Email configuration
export const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
};

// Create nodemailer transporter
export const transporter = nodemailer.createTransport(emailConfig);

// Verify email configuration on startup
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log("✅ Email configuration verified");
  } catch (error) {
    console.log(
      "⚠️  Email configuration not verified (this is okay for testing):",
      error.message
    );
  }
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    service: "email-service",
    status: "healthy",
    emailConfigured: !!emailConfig.auth.user,
    developmentMode: process.env.NODE_ENV === "development",
    timestamp: new Date().toISOString(),
  });
});

// Email service status
app.get("/status", async (req, res) => {
  try {
    let emailStatus = "unknown";
    try {
      await transporter.verify();
      emailStatus = "connected";
    } catch (error) {
      emailStatus = "disconnected";
    }

    res.json({
      service: "email-service",
      kafkaConsumer: "running",
      emailTransporter: emailStatus,
      developmentMode: process.env.NODE_ENV === "development",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      service: "email-service",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Initialize service
async function startService() {
  try {
    console.log("🚀 Starting Email Service...");

    // Verify email configuration
    await verifyEmailConfig();

    // Connect Kafka consumer
    await connectConsumer();

    // Start consuming messages
    await consumeMessages();

    // Start Express server for health checks
    app.listen(PORT, () => {
      console.log(`✅ Email Service running on http://localhost:${PORT}`);
      console.log(`📋 Available endpoints:
        GET /health - Health check
        GET /status - Service status`);
      console.log("📨 Kafka consumer is running and waiting for messages...");

      if (process.env.NODE_ENV === "development") {
        console.log(
          "🔧 Running in development mode - emails will be logged instead of sent"
        );
      }
    });
  } catch (error) {
    console.error("❌ Failed to start Email Service:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down Email Service...");
  await disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Shutting down Email Service...");
  await disconnect();
  process.exit(0);
});

startService();
