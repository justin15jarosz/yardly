import UserService from "../service/user.service.js";
import AddressService from "../service/address.service.js";
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

  // Create new user address
  async createAddress(req, res) {
    try {
      const addressRequest = req.body;

      const address = await AddressService.createAddress(addressRequest);
      res.status(201).json({
        message: "Address created successfully",
        address
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

  async getAddresses(req, res) {
    
  }
}

export default new UserController();
