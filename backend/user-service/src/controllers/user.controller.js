import UserService from "../service/user.service.js";
import BaseException from "../exceptions/base.exception.js";

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
}

export default new UserController();
