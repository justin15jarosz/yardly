import UserAuthRepository from "../repository/user.auth.repository.js";
import ExceptionFactory from "../exceptions/exception.factory.js";
import UserServiceClient from "../utils/user.service.client.js";
import { cacheManager } from "../config/cache.manager.js";

class FinalizeRegistrationService {
  static async finalizeRegistration(email, otp, password) {
    const cacheKey = `otp_registration_${email}`;
    try {
      // Get OTP code from cache and validate
      const res = await cacheManager.get(cacheKey);
      if (res.otp === otp) {
        try {
          // Check user exists in user-service
          const user = await UserServiceClient.getUserByEmail({ email });

          // Save user credentials to db
          await UserAuthRepository.createUserCredentials(user.user_id, email, password);

          // Update user row in user-service to active
          await UserServiceClient.markUserActive(user.user_id);
          
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