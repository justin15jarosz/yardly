import express from 'express';
import registrationController from '../../controllers/registration.controller.js';
import { validatePassword } from '../../utils/validate.auth.js';

const router = express.Router();

// Verify OTP and complete registration
router.post("/register/finalize", validatePassword, registrationController.finalizeRegistration);

export default router;
