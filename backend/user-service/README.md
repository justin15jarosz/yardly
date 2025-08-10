Responsibilities:

- Authentication & authorization (role-based: homeowner, business, admin)
- User profile management (customers and businesses)
- Password reset, email verification

Technology:

- Node.js + Express (or Fastify for performance)
- JWT (access + refresh token pattern)
- PostgreSQL for user data
- Optional Redis for session blacklist / rate limiting

Communication:

- Public REST API (HTTP) for frontend
- Internal events via message queue (e.g., user.created, user.updated)
