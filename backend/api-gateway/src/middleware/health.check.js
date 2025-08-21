const axios = require('axios');
const { services } = require('../config/services');

const healthCheck = async (req, res) => {
  const serviceHealth = {};
  
  // Check each service
  for (const [serviceName, serviceConfig] of Object.entries(services)) {
    try {
      const response = await axios.get(`${serviceConfig.url}/health`, {
        timeout: 5000
      });
      serviceHealth[serviceName] = {
        status: 'healthy',
        response: response.data
      };
    } catch (error) {
      serviceHealth[serviceName] = {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  const allHealthy = Object.values(serviceHealth).every(
    service => service.status === 'healthy'
  );

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    gateway: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    },
    services: serviceHealth
  });
};

module.exports = { healthCheck };