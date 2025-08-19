import express from "express";
import userController from "../../controllers/user.controller.js";
import { validateUser, requestLogger } from "../../utils/validate.user.js";
const router = express.Router();

// Apply logging middleware to all routes
router.use(requestLogger);

// POST create new user (register)
router.post("/register/initialize", validateUser, userController.intializeRegistration);

export default router;
