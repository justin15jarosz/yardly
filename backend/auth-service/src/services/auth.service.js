import bcrypt from 'bcrypt';
import UserAuthRepository from "../repository/user.auth.repository.js";
import ExceptionFactory from "../exceptions/exception.factory.js";

class AuthService {

    static async login(email, password) {
        try {
            // Find user credentials
            const user = await UserAuthRepository.findByEmail(email);

            // Validate passwords
            if (!user || !(await bcrypt.compare(password, user.password))) {
                await ExceptionFactory.throwUnauthorized("Invalid credentials");
            }
            
            return user;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
}

export default AuthService;