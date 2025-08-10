Responsibilities:

- Authorization determines what actions authenticated users or services can perform
- Token Verification: API Gateway or individual services verify JWT signature and expiry using the public key or call Auth Service introspection
- RBAC: Grants access based on predefined roles

Communication:

- Consumes events from message bus
- REST API to query notification history/status

Tables:

- Roles

  - RoleID (UUID)
  - RoleName (varchar)
  - Description (varchar)

- Permissions

  - PermissionID (UUID)

  - PermissionName (varchar) e.g., booking:create

- RolePermissions

  - RoleID
  - PermissionID

- UserRoles

  - UserID
  - RoleID
  - AssignedAt
