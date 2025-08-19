// src/services/password.service.js
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { cacheManager } from '../config/cache.manager.js';

class PasswordService {
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
