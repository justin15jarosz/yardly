import db from "../config/database.js";
import bcrypt from "bcrypt";
import UserCredentials from "../models/user.credentials.js";

class UserAuthRepository {

  static async createUserCredentials(user_id, email, password) {
    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const query = `
        INSERT INTO credentials (user_id, email, password)
        VALUES ($1, $2, $3)
        RETURNING credentials_id, user_id, email, created_at, updated_at
      `;

      const result = await db.query(query, [user_id, email, hashedPassword]);
      return new UserCredentials(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

    // Update user password
  static async updatePassword(email, password) {
    try {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const query = `
        UPDATE credentials
        SET password = $1,
            updated_at = NOW()
        WHERE email = $2
        RETURNING credentials_id, email, created_at, updated_at
      `;

      const result = await db.query(query, [hashedPassword, email]);
      return new UserCredentials(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = `
        SELECT user_id, email, password FROM credentials
        WHERE email = $1
      `;
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default UserAuthRepository;