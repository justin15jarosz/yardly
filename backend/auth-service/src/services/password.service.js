import crypto from 'crypto';
import { cacheManager } from '../config/cache.manager.js';
import { publishMessage, TOPICS } from "../config/kafka.js";
import ExceptionFactory from '../exceptions/exception.factory.js';
import UserServiceClient from "../utils/user.service.client.js";
import { NotFoundException } from '../exceptions/specialized.exception.js';
import UserAuthRepository from '../repository/user.auth.repository.js';

class PasswordService {
    async sendResetPassword(email) {
        try {
            // Find user from user-service - throw error if does not exist
            const user = await UserServiceClient.getUserByEmail({ email });
            await ExceptionFactory.throwIf(!user, NotFoundException, `Unable to find user with email: ${email}`)

            // Generate reset token for email
            const reset_token = await PasswordService.generateResetToken(user.user_id);
           
            // Prepare message for Kafka
            const kafkaMessage = {
                user_id: user.user_id,
                email: user.email,
                name: user.name,
                purpose: "reset-password",
                reset_token: reset_token,
                timestamp: new Date().toISOString(),
                websiteUrl: process.env.WEBSITE_URL || "http://localhost:4000",
            };

            // Publish to Kafka
            await publishMessage(TOPICS.RESET_PASSWORD, kafkaMessage);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error("Internal Service Error:", error);
            await ExceptionFactory.throw(BaseException, `${error}`);
        }
    }

    async resetPassword(userId, password) {
        try {            
            // Find if user credentials match - throw error if doesn't exist
            const userCredentials = await User.findByUserId(userId);
            await ExceptionFactory.throwIf(!userCredentials, NotFoundException, `Unable to find user with id: ${userId}`)
            
            // Update password in db
            return await UserAuthRepository.updatePassword(userCredentials.credentials_id, password);
        } catch (error) {
            console.log(`Error resetting password with userId: ${userId}`);
            throw error;
        }
    }

    async generateResetToken(userId) {
        const token = jwt.sign({ sub: userId }, process.env.JWT_RESET_SECRET, {
            expiresIn: '1h',
        });
        await cacheManager.set(`reset_${userId}`, token, 'EX', 3600);
        return token;
    };

    async verifyResetToken(token) {
        const payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const stored = await cacheManager.get(`reset_${payload.sub}`);
        if (!crypto.timingSafeEqual(stored, token)) throw new Error('Invalid or expired token');
        return payload.sub;
    };

    async invalidateResetToken(userId) {
        await cacheManager.del(`reset_${userId}`);
    };
}

export default new PasswordService();
