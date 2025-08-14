import { consumer } from "../config/kafka.js";
import { sendOTPEmail } from "../sendEmail.js";

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
          const { userId, email, name, otp, otpToken, websiteUrl } =
            messageData;

          if (!email || !name || !otp || !otpToken) {
            console.error(
              "❌ Invalid message format - missing required fields"
            );
            return;
          }

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
