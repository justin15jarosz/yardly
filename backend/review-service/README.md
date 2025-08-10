Responsibilities:

- Submission, moderation (basic filters), and display of reviews & ratings
- Business responses to reviews
- Aggregate score computation for Business Service

Technology:

- Node.js + Express
- PostgreSQL for reviews, with denormalized aggregates for quick reads

Communication:

- REST API
- Emits review.submitted events consumed by Notification Service and Business Service to update aggregates
