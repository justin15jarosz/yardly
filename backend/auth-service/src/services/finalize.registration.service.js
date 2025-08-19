import UserAuthRepository from "../repository/user.auth.repository.js";
import ExceptionFactory from "../middlewares/exceptions/exception.factory.js";
import { cacheManager } from "../config/cache.manager.js";

class FinalizeRegistrationService {
  static async finalizeRegistration(email, otp, password) {
    const cacheKey = `otp_registration_${email}`;
    try {
      const value = await cacheManager.get(cacheKey);
      console.log("Retrieved from cache:", value);
      if (value === otp) {
        try {
          await UserAuthRepository.createUserCredentials(email, password);
          console.log(`✅ User registration finalized: ${email}`);
          await cacheManager.del(cacheKey);
        } catch (error) {
          console.error("Error updating password:", error);
          await ExceptionFactory.throwValidation(
            "Error updating password",
            "password",
            password,
            { email }
          );
        }
      } else {
        await ExceptionFactory.throwValidation("Invalid OTP", "otp", otp, { email });
      }
    } catch (err) {
      // Throw errors upstream for Controller to handle res
      throw err;
    }
  }
}

export default FinalizeRegistrationService;