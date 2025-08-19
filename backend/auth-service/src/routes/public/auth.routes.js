import express from 'express';
import authController from '../../controllers/auth.controller.js';
import passwordController from '../../controllers/password.controller.js';
const router = express.Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

router.post('/forgot-password', passwordController.forgotPassword);
router.post('/reset-password', passwordController.resetPassword);

export default router;
