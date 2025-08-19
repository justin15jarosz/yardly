// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import tokenService from '../services/token.service.js';
import redisClient from '../config/cacheManager.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const accessToken = tokenService.generateAccessToken(user);
      const refreshToken = tokenService.generateRefreshToken(user);

      await redisClient.set(`refresh_${user.id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days

      res.json({ accessToken, refreshToken });
    } catch (err) {
      next(err);
    }
  };

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const payload = tokenService.verifyRefreshToken(refreshToken);

      const stored = await redisClient.get(`refresh_${payload.sub}`);
      if (stored !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const newAccessToken = tokenService.generateAccessToken({ id: payload.sub });
      const newRefreshToken = tokenService.generateRefreshToken({ id: payload.sub });

      await redisClient.set(`refresh_${payload.sub}`, newRefreshToken, 'EX', 7 * 24 * 60 * 60);

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  };

  async logout(req, res, next) {
    try {
      const { userId } = req.body;
      await redisClient.del(`refresh_${userId}`);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
