import UserRepository from "../repository/userRepository.js";

export const createUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { Email, Password, Name } = req.body;
    const newUser = await User.create({ Email, Password, Name });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
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
}

export default new UserController();
