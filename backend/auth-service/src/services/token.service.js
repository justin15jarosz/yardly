// src/services/token.service.js
import jwt from 'jsonwebtoken';

class TokenService {
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