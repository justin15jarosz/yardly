import db from "../config/database.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

class UserRepository {
  // Create new user
  static async create(userData) {
    const { email, name, is_verified = false } = userData;

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

  // Update user password
  static async updatePassword(data) {
    const { email, password } = data;

    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `
        UPDATE users
        SET password = $1
        WHERE email = $2
        RETURNING user_id, email, name, created_at, is_verified
      `;

      const result = await db.query(query, [hashedPassword, email]);
      return new User(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email, includePassword = false) {
    const fields = includePassword
      ? "user_id, email, password, name, created_at, is_verified"
      : "user_id, email, name, created_at, is_verified";

    const query = `SELECT ${fields} FROM users WHERE email = $1`;

    try {
      const result = await db.query(query, [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      throw error;
    }
  }
}

export default UserRepository;
