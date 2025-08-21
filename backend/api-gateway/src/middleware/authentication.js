const jwt = require('jsonwebtoken');
const axios = require('axios');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is required'
    });
  }

  try {
    // Verify token locally
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    // Optional: Verify with auth service for additional security
    if (process.env.VERIFY_WITH_AUTH_SERVICE === 'true') {
      const verifyResponse = await axios.get(
        `${process.env.AUTH_SERVICE_URL}/api/auth/verify`,
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000
        }
      );

      if (!verifyResponse.data.success) {
        return res.status(401).json({
          success: false,
          message: 'Token verification failed'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = { authenticateToken };