const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL,
    prefix: '/auth',
    requiresAuth: false
  },
  authz: {
    url: process.env.AUTHNZ_SERVICE_URL,
    prefix: '/authz',
    requiresAuth: true
  },
  users: {
    url: process.env.USER_SERVICE_URL,
    prefix: '/users',
    requiresAuth: true
  },
  products: {
    url: process.env.PRODUCT_SERVICE_URL,
    prefix: '/products',
    requiresAuth: false // Some product endpoints might be public
  }
};

// Route-specific configurations
const routeConfig = {
  // Auth routes (no auth required)
  'POST /api/auth/login': { 
    service: 'auth', 
    requiresAuth: false,
    rateLimit: { windowMs: 15 * 60 * 1000, max: 5 } // 5 requests per 15 minutes
  },
  'GET /api/auth/verify': { 
    service: 'auth', 
    requiresAuth: false 
  },

  // User routes (auth required)
  'GET /api/users': { 
    service: 'users', 
    requiresAuth: true,
    permissions: ['read', 'admin']
  },
  'GET /api/users/:id': { 
    service: 'users', 
    requiresAuth: true,
    permissions: ['read', 'admin'],
    allowOwner: true // User can access their own data
  },
  'POST /api/users': { 
    service: 'users', 
    requiresAuth: true,
    permissions: ['write', 'admin'],
    roles: ['admin']
  },
  'PUT /api/users/:id': { 
    service: 'users', 
    requiresAuth: true,
    permissions: ['write', 'admin'],
    allowOwner: true
  },
  'DELETE /api/users/:id': { 
    service: 'users', 
    requiresAuth: true,
    permissions: ['delete', 'admin'],
    roles: ['admin']
  },

//   Demo Mixed Auth
//   'GET /api/products': { 
//     service: 'products', 
//     requiresAuth: false 
//   },
//   'GET /api/products/:id': { 
//     service: 'products', 
//     requiresAuth: false 
//   },
//   'POST /api/products': { 
//     service: 'products', 
//     requiresAuth: true,
//     permissions: ['write', 'admin']
//   },
//   'PUT /api/products/:id': { 
//     service: 'products', 
//     requiresAuth: true,
//     permissions: ['write', 'admin']
//   },
//   'DELETE /api/products/:id': { 
//     service: 'products', 
//     requiresAuth: true,
//     permissions: ['delete', 'admin']
//   },

  // Authorization service routes
  'GET /api/authz/permissions': { 
    service: 'authz', 
    requiresAuth: true 
  },
  'GET /api/authz/permission/:permission': { 
    service: 'authz', 
    requiresAuth: true 
  }
};

module.exports = { services, routeConfig };