const express = require('express');
const { routeConfig } = require('../config/services');
const { authenticateToken } = require('../middleware/authentication');
const { checkPermissions, checkRoles, checkOwnership } = require('../middleware/authorization');
const { validateRequest, validateQueryParams } = require('../middleware/validation');
const { createRateLimit } = require('../middleware/rateLimiting');
const { createServiceProxy } = require('../middleware/proxy');

const router = express.Router();

// Function to create route handler with all middleware
const createRouteHandler = (method, path, config) => {
  const middlewares = [];

  // Add rate limiting if specified
  if (config.rateLimit) {
    middlewares.push(createRateLimit(config.rateLimit));
  }

  // Add query parameter validation for GET requests
  if (method === 'GET') {
    middlewares.push(validateQueryParams);
  }

  // Add request body validation
  middlewares.push(validateRequest);

  // Add authentication if required
  if (config.requiresAuth) {
    middlewares.push(authenticateToken);
    
    // Add permission checks
    if (config.permissions) {
      middlewares.push(checkPermissions(config.permissions));
    }
    
    // Add role checks
    if (config.roles) {
      middlewares.push(checkRoles(config.roles));
    }
    
    // Add ownership check for routes with :id parameter
    if (config.allowOwner && path.includes(':id')) {
      middlewares.push(checkOwnership);
    }
  }

  // Add service proxy as the final middleware
  middlewares.push(createServiceProxy(config.service));

  return middlewares;
};

// Register all routes from configuration
Object.entries(routeConfig).forEach(([routeKey, config]) => {
  const [method, path] = routeKey.split(' ');
  const middlewares = createRouteHandler(method, path, config);
  
  switch (method.toUpperCase()) {
    case 'GET':
      router.get(path.replace('/api', ''), ...middlewares);
      break;
    case 'POST':
      router.post(path.replace('/api', ''), ...middlewares);
      break;
    case 'PUT':
      router.put(path.replace('/api', ''), ...middlewares);
      break;
    case 'PATCH':
      router.patch(path.replace('/api', ''), ...middlewares);
      break;
    case 'DELETE':
      router.delete(path.replace('/api', ''), ...middlewares);
      break;
  }
});

module.exports = router;