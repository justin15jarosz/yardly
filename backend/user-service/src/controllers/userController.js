import { publishMessage, TOPICS } from "../config/kafka.js";
import { cacheManager } from "../server.js";
import UserService from "../service/userService.js";
import UserRepository from "../repository/userRepository.js";
import BaseException from "../exception/baseException.js";

class UserController {
  // Create new user
  async createUser(req, res) {
    try {
      const { email, name } = req.body;

      const user = await UserService.createUser(email, name);
      return res.status(201).json({
        message: "User created successfully",
        user,
      });
    } catch (error) {
      if (error instanceof BaseException) {
        return res.status(error.statusCode).json({
          error: error.message,
          additionalData: error.additionalData || {},
        });
      }
      console.error("Error in createUser:", error);
        return res.status(500).json({
          error: "Internal server error",
        });
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
