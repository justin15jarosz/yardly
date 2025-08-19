import UserRepository from "../repository/user.repository.js";
import { publishMessage, TOPICS } from "../config/kafka.js";
import ExceptionFactory from "../middlewares/exceptions/exception.factory.js";
import { ConflictException } from "../middlewares/exceptions/specialized.exception.js";
import BaseException from "../middlewares/exceptions/base.exception.js";

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
}

export default UserService;
