import UserRepository from "../repository/userRepository.js";
import { publishMessage, TOPICS } from "../config/kafka.js";
import { cacheManager } from "../server.js";

class UserController {
  // Create new user
  async createUser(req, res) {
    try {
      const { email, name } = req.body;

      // Check if user with email already exists
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

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
      res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      console.error("Error in createUser:", error);

      if (error.code === "23505") {
        // Unique violation
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      if (error.code === "23514") {
        // Check constraint violation
        return res.status(400).json({ error: "Invalid data provided" });
      }

      res.status(500).json({ error: "Internal server error" });
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

export default new UserController();
