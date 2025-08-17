import UserRepository from "../repository/userRepository.js";
import { publishMessage, TOPICS } from "../config/kafka.js";
import { cacheManager } from "../server.js";
import ExceptionFactory from "../exception/exceptionFactory.js";
import SpecializedException from "../exception/specializedException.js";

class UserService {
  // Create new user
  static async createUser(email, name) {
    try {
      // Check if user with email already exists
      const existingUser = await UserRepository.findByEmail(email);
      await ExceptionFactory.throwIf(existingUser, SpecializedException.ConflictException, "User with this email already exists.");

      const user = await UserRepository.create({ email, name });

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
      if (error instanceof SpecializedException.ConflictException) {
        throw error;
      }

      // Handle other errors, such as database errors or Kafka publishing issues
      console.error("Error publishing to Kafka:", kafkaError);
      ExceptionFactory.throw(InternalServerException, "Failed to publish user registration message", kafkaError);
    }
  }

  // Create new user
  async finalizeRegistration(req, res) {
    const { email, otp, password } = req.body;
    const cacheKey = `otp_registration_${email}`;
    cacheManager.get(cacheKey).then((value) => {
      console.log("Retrieved from cache:", value);
    });
    res.status(201).json({ message: "Finalize registration endpoint hit" });
  }
}

export default UserService;
