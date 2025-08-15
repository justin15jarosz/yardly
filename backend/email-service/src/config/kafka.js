import { Kafka } from "kafkajs";

// Kafka configuration
const kafka = new Kafka({
  clientId: "user-registration-app",
  brokers: ["localhost:9092"], // Default Kafka broker address
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

// Topics configuration
const TOPICS = {
  USER_REGISTRATIONS: "user-registrations",
};

// Create consumer instance
export const consumer = kafka.consumer({
  groupId: "email-service-group",
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
});

// Connect consumer
export async function connectConsumer() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPICS.USER_REGISTRATIONS });
    console.log("✅ Kafka consumer connected and subscribed");
  } catch (error) {
    console.error("❌ Error connecting consumer:", error);
    throw error;
  }
}

// Graceful shutdown
export async function disconnect() {
  try {
    await consumer.disconnect();
    console.log("✅ Kafka connections closed");
  } catch (error) {
    console.error("❌ Error disconnecting from Kafka:", error);
  }
}
