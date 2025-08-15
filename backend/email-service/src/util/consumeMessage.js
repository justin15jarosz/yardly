import { consumer } from "../config/kafka.js";
import { sendOTPEmail } from "../sendEmail.js";
import { cacheManager } from "../server.js";
import { generateOTP, generateOTPToken } from "./generateToken.js";

// Kafka message consumer
export async function consumeMessages() {
  try {
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageData = JSON.parse(message.value.toString());
          console.log("📨 Received message from Kafka:", {
            topic,
            partition,
            offset: message.offset,
            userId: messageData.userId,
          });

          // Extract user data
          const { userId, email, name, purpose, websiteUrl } = messageData;

          if (!email || !name || !purpose) {
            console.error(
              "❌ Invalid message format - missing required fields"
            );
            return;
          }
          // Have to refactor in the future utilizing purpose from message
          const otp = generateOTP();
          const otpToken = generateOTPToken(email, otp);

          // Store OTP in shared cache
          const cacheKey = `otp_${purpose}_${email}`;
          await cacheManager.set(
            cacheKey,
            {
              otp,
              email,
              purpose,
              timestamp: Date.now(),
              attempts: 0,
            },
            600
          ); // 10 minutes TTL
          console.log(
            `🔐 Stored OTP in cache with key: ${cacheKey} , value: ${otp}`
          );

          // Send OTP email
          const emailResult = await sendOTPEmail(
            email,
            name,
            otp,
            otpToken,
            websiteUrl
          );

          if (emailResult.success) {
            console.log(
              `✅ OTP email processed successfully for user: ${email}`
            );
          }
        } catch (error) {
          console.error("❌ Error processing Kafka message:", error);
        }
      },
    });
  } catch (error) {
    console.error("❌ Error in Kafka consumer:", error);
    throw error;
  }
}
