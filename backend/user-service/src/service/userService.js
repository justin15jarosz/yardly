import UserRepository from "../repository/userRepository.js";
import { publishMessage, TOPICS } from "../config/kafka.js";
import { cacheManager } from "../server.js";
import ExceptionFactory from "../exception/exceptionFactory.js";
import { ConflictException } from "../exception/specializedException.js";
import BaseException from "../exception/baseException.js";

class UserService {
  // Create new user
  static async createUser(email, name) {
    try {
      // Check if user with email already exists
      const existingUser = await UserRepository.findByEmail(email);
      await ExceptionFactory.throwIf(existingUser, ConflictException, `User with this email already exists: ${email}`);

      const user = (await UserRepository.create({ email, name })).toJSON();

      // Prepare message for Kafka
      const kafkaMessage = {
        user_id: user.user_id,
        email: user.email,
        name: user.name,
        purpose: "registration",
        timestamp: new Date().toISOString(),
        websiteUrl: process.env.WEBSITE_URL || "http://localhost:3001",
      };

      // Publish to Kafka
      await publishMessage(TOPICS.USER_REGISTRATIONS, kafkaMessage);
      console.log(`📝 User registered: ${email}`);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      // Handle other errors, such as database errors or Kafka publishing issues
      console.error("Internal Service Error:", error);
      await ExceptionFactory.throw(BaseException, `${error}`);
    }
  }

  // Finalize user registration
  static async finalizeRegistration(email, otp, password) {
    const cacheKey = `otp_registration_${email}`;
    try {
      const value = await cacheManager.get(cacheKey);
      console.log("Retrieved from cache:", value);
      if (value === otp) {
        try {
          await UserRepository.updatePassword(email, password);
          console.log(`✅ User registration finalized: ${email}`);
          await cacheManager.del(cacheKey);
        } catch (error) {
          console.error("Error updating password:", error);
          await ExceptionFactory.throwValidation(
            "Error updating password",
            "password",
            password,
            { email }
          );
        }
      } else {
        await ExceptionFactory.throwValidation("Invalid OTP", "otp", otp, { email });
      }
    } catch (err) {
      // Throw errors upstream for Controller to handle res
      throw err;
    }
  }
}

export default UserService;
