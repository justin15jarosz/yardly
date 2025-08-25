import express from 'express';
import authController from '../../controllers/auth.controller.js';
import passwordController from '../../controllers/password.controller.js';
import { validatePasswords, validateEmail, validateLogin } from '../../utils/validate.auth.js';
const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.post('/verify', authController.verifyToken);
router.post('/logout', authController.logout);

router.post('/forgot-password', validatePasswords, passwordController.forgotPassword);
router.post('/reset-password', validateEmail, passwordController.resetPassword);

export default router;
