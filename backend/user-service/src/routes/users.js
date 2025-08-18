import express from "express";
import userController from "../controllers/userController.js";
import { validateUser, requestLogger } from "../util/validateUser.js";
const router = express.Router();

// Apply logging middleware to all routes
router.use(requestLogger);

// POST create new user (register)
router.post("/register/initialize", validateUser, userController.intializeRegistration);

// Verify OTP and complete registration
router.post("/register/finalize", userController.finalizeRegistration);

export default router;
