import { Kafka } from "kafkajs";

// Kafka configuration
const kafka = new Kafka({
  clientId: "user-registration-app",
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092'],
  retry: {
    initialRetryTime: 100,
    retries: 8,
  },
});

// Topics configuration
const TOPICS = {
  USER_REGISTRATIONS: "user-registrations",
  RESET_PASSWORD: "reset-password"
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
    const topicList = Object.values(TOPICS);
    for (const topic of topicList) {
      await consumer.subscribe({ topic, fromBeginning: true });
    }
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
