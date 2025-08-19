// src/controllers/password.controller.js
import User from '../models/user.js';
import passwordService from '../services/password.service.js';

class PasswordController {
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      const token = await passwordService.generateResetToken(user.id);
      // await mailService.sendPasswordReset(email, token);

      res.json({ message: 'Reset link sent to email' });
    } catch (err) {
      next(err);
    }
  };

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const userId = await passwordService.verifyResetToken(token);

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.password = newPassword;
      await user.save();

      await passwordService.invalidateResetToken(userId);

      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      next(err);
    }
  };
}

export default new PasswordController();
