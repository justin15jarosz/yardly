import bcrypt from 'bcrypt';
import UserAuthRepository from "../repository/user.auth.repository.js";
import { ExceptionFactory, UnauthorizedException } from "shared";

class AuthService {

    static async login(email, password) {
        try {
            const user = await UserAuthRepository.findByEmail(email);
            if (!user.password || !(await bcrypt.compare(password, user.password))) {
                await ExceptionFactory.throwUnauthorized("Invalid credentials");
            }
            return user.user_id;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }
}

export default AuthService;