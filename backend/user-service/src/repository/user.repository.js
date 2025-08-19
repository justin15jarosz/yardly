import db from "../config/database.js";
import User from "../models/user.js";

class UserRepository {
  // Create new user
  static async create(userData) {
    const { email, name } = userData;

    // Default is_verified to false for new users
    const is_verified = false;

    try {
      const query = `
        INSERT INTO users (email, name, is_verified)
        VALUES ($1, $2, $3)
        RETURNING user_id, email, name, created_at, is_verified
      `;

      const result = await db.query(query, [email, name, is_verified]);
      return new User(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = `SELECT user_id, email, name, created_at, is_verified FROM users WHERE email = $1`;

    try {
      const result = await db.query(query, [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }

  static async verifyUser(user_id) {
    const query = `UPDATE users SET is_verified = TRUE WHERE user_id = $1`;

    try {
      const result = await db.query(query, [user_id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
