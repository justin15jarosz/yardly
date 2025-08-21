const { createProxyMiddleware } = require('http-proxy-middleware');
const { services } = require('../config/services');

const createServiceProxy = (serviceName) => {
  const service = services[serviceName];
  
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }

  return createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Remove /api from the path before forwarding
      return path.replace('/api', '/api');
    },
    onError: (err, req, res) => {
      console.error(`Proxy error for ${serviceName}:`, err.message);
      res.status(503).json({
        success: false,
        message: `Service ${serviceName} is currently unavailable`
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add user info to headers for downstream services
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Email', req.user.email);
        proxyReq.setHeader('X-User-Role', req.user.role);
        proxyReq.setHeader('X-User-Permissions', JSON.stringify(req.user.permissions || []));
      }
      
      // Log the request
      console.log(`Proxying ${req.method} ${req.url} to ${serviceName}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add CORS headers
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';
    }
  });
};

module.exports = { createServiceProxy };