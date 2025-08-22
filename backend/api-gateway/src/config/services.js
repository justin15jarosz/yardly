import dotenv from "dotenv";
dotenv.config();

// Service definitions
export const services = {
  auth: {
    url: process.env.AUTH_SERVICE_URL,
    prefix: "/auth",
    requiresAuth: false,
    routes: {
      "POST /login": {
        requiresAuth: false,
        rateLimit: { windowMs: 15 * 60 * 1000, max: 5 } // 5 requests per 15 minutes
      },
      "GET /verify": { requiresAuth: false }
    }
  },
  authz: {
    url: process.env.AUTHNZ_SERVICE_URL,
    prefix: "/authz",
    requiresAuth: true,
    routes: {
      "GET /permissions": { requiresAuth: true },
      "GET /permission/:permission": { requiresAuth: true }
    }
  },
  users: {
    url: process.env.USER_SERVICE_URL,
    prefix: "/users",
    requiresAuth: true,
    routes: {
      "GET /": { permissions: ["read", "admin"] },
      "GET /:id": { permissions: ["read", "admin"], allowOwner: true },
      "POST /": { permissions: ["write", "admin"], roles: ["admin"] },
      "PUT /:id": { permissions: ["write", "admin"], allowOwner: true },
      "DELETE /:id": { permissions: ["delete", "admin"], roles: ["admin"] },
      "POST /register/initialize": { requiresAuth: false },
      "POST /address": { permissions: ["write", "admin"], roles: ["admin"] }
    }
  }
};

// Auto-generate routeConfig by combining service prefix + routes
export const routeConfig = Object.entries(services).reduce((acc, [serviceName, service]) => {
  if (service.routes) {
    Object.entries(service.routes).forEach(([routeKey, config]) => {
      const [method, relativePath] = routeKey.split(" ");
      const fullPath = `/api${service.prefix}${relativePath}`;
      acc[`${method.toUpperCase()} ${fullPath}`] = {
        service: serviceName,
        requiresAuth: config.requiresAuth ?? service.requiresAuth,
        ...config
      };
    });
  }
  return acc;
}, {});
