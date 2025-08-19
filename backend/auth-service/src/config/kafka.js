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
export const TOPICS = {
  USER_REGISTRATIONS: "user-registrations",
};

// Create producer instance
const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
  transactionTimeout: 30000,
});

// Admin client for topic management
const admin = kafka.admin();

// Initialize Kafka topics
export async function createTopics() {
  try {
    await admin.connect();

    const existingTopics = await admin.listTopics();
    const topicsToCreate = [];

    if (!existingTopics.includes(TOPICS.USER_REGISTRATIONS)) {
      topicsToCreate.push({
        topic: TOPICS.USER_REGISTRATIONS,
        numPartitions: 3,
        replicationFactor: 1,
      });
    }

    if (topicsToCreate.length > 0) {
      await admin.createTopics({
        topics: topicsToCreate,
      });
      console.log("✅ Kafka topics created successfully");
    } else {
      console.log("✅ All required topics already exist");
    }

    await admin.disconnect();
  } catch (error) {
    console.error("❌ Error creating Kafka topics:", error);
    throw error;
  }
}

// Connect producer
export async function connectProducer() {
  try {
    await producer.connect();
    console.log("✅ Kafka producer connected");
  } catch (error) {
    console.error("❌ Error connecting producer:", error);
    throw error;
  }
}

// Publish message to Kafka
export async function publishMessage(topic, message) {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: message.userId,
          value: JSON.stringify(message),
          timestamp: Date.now(),
        },
      ],
    });
    console.log("✅ Message published to Kafka:", {
      topic,
      userId: message.userId,
    });
  } catch (error) {
    console.error("❌ Error publishing message:", error);
    throw error;
  }
}

// Graceful shutdown
export async function disconnect() {
  try {
    await producer.disconnect();
    console.log("✅ Kafka connections closed");
  } catch (error) {
    console.error("❌ Error disconnecting from Kafka:", error);
  }
}
