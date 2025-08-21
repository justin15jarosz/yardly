import jwt from 'jsonwebtoken';

class TokenService {
  async generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions
    };

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