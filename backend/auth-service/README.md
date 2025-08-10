Responsibilities:

- Authentication verifies the identity of users or services accessing the system
- Provide JWT tokens that can be verified by authnz-service
- OAuth 2.0

Communication:

- Communicates with user-service private api to retreive user password

Table:

- LoginAttempts (optional)

  - AttemptID (UUID)
  - UserID (UUID)
  - Timestamp (timestamp)
  - IpAddress (varchar)
  - Success (boolean)

- RefreshTokens

  - TokenID (UUID)
  - UserID (UUID)
  - IssuedAt (timestamp)
  - ExpiresAt (timestamp)
  - DeviceInfo (varchar)
  - Revoked (boolean)
