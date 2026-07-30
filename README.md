# DJCorner

DJCorner is a single-store e-commerce application with a React/Vite frontend
and a Spring Boot/PostgreSQL backend.

## Staff roles

- `CUSTOMER`: shops and views only their own orders.
- `SUPPORT`: can inspect all orders but cannot change fulfilment state.
- `FULFILLMENT`: can move orders through approved logistics states.
- `ADMIN`: manages products, staff roles, audit logs, and all valid order transitions.

New registrations always receive the `CUSTOMER` role. Roles submitted by a
client are never accepted during registration.

## First administrator

If no administrator exists, the backend can create or promote the configured
bootstrap account:

```text
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-strong-password-with-at-least-12-characters
ADMIN_NAME=Store Administrator
```

The bootstrap is skipped after an administrator exists. Remove the bootstrap
password from the deployment environment after the first administrator has
been created.

Existing users must log in again after the role migration so their JWT contains
the new `role` claim.

## Staff consoles

- `/admin`: product management, staff role assignment, and audit history.
- `/staff/orders`: order operations for admin, support, and fulfilment staff.

Product deletion is implemented as archival so historical orders retain their
product references. Archived products disappear from the public catalogue and
can be restored by an administrator.

## Development

The backend defaults to the `local` Spring profile. Production must use:

```text
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<random-secret-containing-at-least-32-bytes>
```

Backend tests use an isolated H2 database and do not connect to the configured
Neon/PostgreSQL instance.
