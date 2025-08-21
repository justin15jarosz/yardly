import express from "express";
import userController from "../../controllers/user.controller.js";
import { validateUser, requestLogger } from "../../utils/validate.user.js";
import { validateAddress } from "../../utils/validate.address.js"
import { authMiddleware } from "../../middlewares/auth0-middleware.js";

const router = express.Router();

// Apply logging middleware to all routes
router.use(requestLogger);

// POST create new user (register)
router.post("/register/initialize", validateUser, userController.intializeRegistration);

// POST create new address for user
router.post("/address", authMiddleware, validateAddress, userController.createAddress)

export default router;
