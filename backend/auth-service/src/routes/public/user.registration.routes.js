import express from 'express';
import registrationController from '../../controllers/registration.controller.js';
import { validatePasswords } from '../../utils/validate.auth.js';

const router = express.Router();

// Verify OTP and complete registration
router.post("/register/finalize", validatePasswords, registrationController.finalizeRegistration);

export default router;
