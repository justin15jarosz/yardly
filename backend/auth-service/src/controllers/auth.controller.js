import tokenService from '../services/token.service.js';
import { cacheManager } from '../config/cache.manager.js';
import AuthService from '../services/auth.service.js';

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await AuthService.login(email, password);

      const token = await tokenService.generateToken(user);
      // const accessToken = await tokenService.generateAccessToken(user_id);
      // const refreshToken = await tokenService.generateRefreshToken(user_id);

      // await cacheManager.set(`refresh_${user_id}`, refreshToken, 'EX', 7 * 24 * 60 * 60); // 7 days

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            permissions: user.permissions
          }
        }
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
      next(error);
    }
  };

  async verifyToken(req, res) {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.json({
        success: true,
        data: {
          user: decoded
        }
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  };

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const payload = tokenService.verifyRefreshToken(refreshToken);

      const stored = await cacheManager.get(`refresh_${payload.sub}`);
      if (stored !== refreshToken) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      const newAccessToken = tokenService.generateAccessToken({ id: payload.sub });
      const newRefreshToken = tokenService.generateRefreshToken({ id: payload.sub });

      await cacheManager.set(`refresh_${payload.sub}`, newRefreshToken, 'EX', 7 * 24 * 60 * 60);

      res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      next(err);
    }
  };

  async logout(req, res, next) {
    try {
      const { userId } = req.body;
      await cacheManager.del(`refresh_${userId}`);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

export default new AuthController();
