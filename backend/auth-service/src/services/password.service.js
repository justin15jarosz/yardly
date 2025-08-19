// src/services/password.service.js
import jwt from 'jsonwebtoken';
import redis from '../config/cacheManager.js';

class PasswordService {
    async generateResetToken(userId) {
        const token = jwt.sign({ sub: userId }, process.env.JWT_RESET_SECRET, {
            expiresIn: '1h',
        });
        await redis.set(`reset_${userId}`, token, 'EX', 3600);
        return token;
    };

    async verifyResetToken(token) {
        const payload = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const stored = await redis.get(`reset_${payload.sub}`);
        if (stored !== token) throw new Error('Invalid or expired token');
        return payload.sub;
    };

    async invalidateResetToken(userId) {
        await redis.del(`reset_${userId}`);
    };
}

export default new PasswordService();
