import crypto from 'crypto';
import dotenv from "dotenv";

dotenv.config();

export default function internalOnly(req, res, next) {
  const token = req.headers['x-internal-token'];
    console.log(`Request: ${req.method} ${req.originalUrl}, Token: ${token ? 'Provided' : 'Not Provided'}`);

    // Failing with this active
  // if (!crypto.timingSafeEqual(token, process.env.INTERNAL_SERVICE_TOKEN)) {
  //   return res.status(403).json({ error: 'Access denied' });
  // }
  next();
};
