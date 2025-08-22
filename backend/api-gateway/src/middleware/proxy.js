import { createProxyMiddleware } from 'http-proxy-middleware';
import { services } from '../config/services.js';

export const createServiceProxy = (serviceName) => {
  const service = services[serviceName];

  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }

  return createProxyMiddleware({
    target: service.url,
    changeOrigin: true,
    selfHandleResponse: false, // Let proxy handle the response automatically
    onProxyReq: (proxyReq, req) => {
      // Forward JSON body for POST/PUT/PATCH
      if (req.body && Object.keys(req.body).length) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }

      // Forward user info headers if available
      if (req.user) {
        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Email', req.user.email);
        proxyReq.setHeader('X-User-Role', req.user.role);
        proxyReq.setHeader('X-User-Permissions', JSON.stringify(req.user.permissions || []));
      }

      console.log(`➡️ Proxying ${req.method} ${req.originalUrl} → ${serviceName}`);
    },
    onProxyRes: (proxyRes) => {
      // Optional: add CORS headers
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';
    },
    onError: (err, req, res) => {
      console.error(`❌ Proxy error for ${serviceName}:`, err.message);
      res.status(503).json({
        success: false,
        message: `Service ${serviceName} is currently unavailable`,
      });
    }
  });
};
