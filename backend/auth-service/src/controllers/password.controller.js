import passwordService from '../services/password.service.js';

class PasswordController {
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // Send message to email-service
      await passwordService.sendResetPassword(email);

      res.status(201).json({ message: `Email sent to reset password: ${email}` })
    } catch (error) {
      console.error("Error in sending email to reset password: ", error);
      res.status(error.statusCode).json({
        error: error.message
      })
      next(error);
    }
  };

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      // Verify reset token from email
      const userId = await passwordService.verifyResetToken(token);

      // Update password 
      const user = await passwordService.resetPassword(userId, newPassword);

      // Invalidate reset token
      await passwordService.invalidateResetToken(userId);
      res.status(201).json({ message: `Successfully reset password for email: ${user.email}` });
    } catch (error) {
      console.error("Error in resetting password: ", error);
      res.status(error.statusCode).json({
        error: error.message
      })
      next(error);
    }
  };
}

export default new PasswordController();
