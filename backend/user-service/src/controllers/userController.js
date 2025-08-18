import { cacheManager } from "../server.js";
import UserService from "../service/userService.js";
import BaseException from "../exception/baseException.js";

class UserController {
  // Create new user
  async intializeRegistration(req, res) {
    try {
      const { email, name } = req.body;

      const user = await UserService.createUser(email, name);
      res.status(201).json({
        message: "User created successfully",
        user
      });
    } catch (error) {
      if (error instanceof BaseException) {
        res.status(error.statusCode).json({
          error: error.message
        });
      } else {
        console.error("Error in createUser:", error);
        res.status(500).json({
          error: "Internal server error",
        });
      }
    }
  }
  // Create new user
  async finalizeRegistration(req, res) {
    try {
      const { email, otp, password } = req.body;
      await UserService.finalizeRegistration(email, otp, password);
      res.status(201).json({ message: "User registration finalized" });
    } catch (error) {
      console.error("Error in finalizeRegistration:", error);
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}

export default new UserController();
