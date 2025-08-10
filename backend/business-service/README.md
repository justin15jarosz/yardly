Responsibilities:

- Business profiles, offered services (e.g., mowing, pruning), pricing tiers
- Availability / schedule footprint for each crew or team
- Manage request-for-quotes (RFQ) and quote lifecycle
- Customer reviews metadata (aggregate scores)

Technology:

- Node.js + Express
- PostgreSQL (+ PostGIS extension) for geospatial queries
- Optional Elasticsearch for search by services/keywords

Communication:

- REST API for frontend and partner portals
- gRPC for high-performance internal calls (optional)
- Emits events: quote.requested, business.updated
