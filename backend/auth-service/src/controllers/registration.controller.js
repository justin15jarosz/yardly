import FinalizeRegistrationService from "../services/finalize.registration.service.js";

class FinalizeRegistrationController {
      async finalizeRegistration(req, res) {
    try {
      const { email, otp, password } = req.body;
      await FinalizeRegistrationService.finalizeRegistration(email, otp, password);
      res.status(201).json({ message: "User registration finalized" });
    } catch (error) {
      console.error("Error in finalizeRegistration:", error);
      res.status(error.statusCode).json({
        error: error.message
      });
    }
  }
}

export default new FinalizeRegistrationController();