import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

class TokenService {
  async generateToken(user) {
    console.log("User: " + JSON.stringify(user));
    const payload = {
      id: user.user_id,
      email: user.email,
      // role: user.role, TODO: Uncomment when RBAC is implemented
      // permissions: user.permissions
    };
    console.log("Payload: " + JSON.stringify(payload));
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  };
  async generateAccessToken(user) {
    return jwt.sign({ sub: user.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
  };

  async generateRefreshToken(user) {
    return jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
  };

  async verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  };

  async verifyRefreshToken(token) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  };
}

export default new TokenService();