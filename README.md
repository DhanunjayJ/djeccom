# DJCorner

A full-stack, role-aware e-commerce application built with React, Spring Boot,
and PostgreSQL. DJCorner provides a customer storefront, secure checkout,
product administration, staff order operations, inventory tracking, and an
auditable order fulfilment workflow.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

## Features

### Storefront

- Browse active products grouped by category
- View product details, prices, and available stock
- Manage a persistent shopping cart
- Complete payments through Razorpay
- Review personal order history

### Authentication and security

- Stateless JWT authentication using HMAC-SHA256
- BCrypt password hashing
- Role claims embedded in access tokens
- Endpoint and method-level authorization
- Configurable token expiration and CORS origins
- Secrets supplied through environment variables

### Administration and operations

- Create and update products
- Archive and restore products without breaking historical orders
- Assign staff roles to users
- Inspect recent administrative audit events
- View all customer orders
- Move orders through validated fulfilment states
- Preserve a timestamped history of every status change

## Roles and permissions

| Role | Permissions |
| --- | --- |
| `CUSTOMER` | Browse products, check out, and view their own orders |
| `SUPPORT` | Inspect all orders and their status history |
| `FULFILLMENT` | Inspect orders and update approved logistics statuses |
| `ADMIN` | Manage products, user roles, audit logs, and all valid order transitions |

Every new registration receives the `CUSTOMER` role. The backend does not
accept a client-provided role during registration.

## Order lifecycle

Status updates are validated by the backend. Staff cannot skip arbitrary
fulfilment steps.

```text
PENDING_PAYMENT
├── PAID → CONFIRMED → PACKED → SHIPPED → IN_TRANSIT → DELIVERED
├── PAYMENT_FAILED
└── CANCELLED

IN_TRANSIT → DELIVERY_FAILED → IN_TRANSIT
DELIVERED → RETURN_REQUESTED → RETURNED → REFUNDED
                            └→ RETURN_REJECTED
```

Every successful transition creates an order-history entry and an audit event.

## Technology stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Tailwind CSS, Axios |
| Backend | Java 17, Spring Boot 4, Spring MVC, Spring Security |
| Authentication | JWT resource server, BCrypt |
| Persistence | Spring Data JPA, Hibernate, PostgreSQL |
| Migrations | Flyway |
| Payments | Razorpay |
| Testing | JUnit, Mockito, H2 |
| Deployment | Docker, Render-compatible backend |

## Repository structure

```text
djeccom/
├── eccom-frontend/        React and Vite storefront
├── eccom-backend/         Spring Boot REST API
│   ├── src/main/java/     Application source
│   ├── src/main/resources/
│   │   └── db/migration/  Flyway migrations
│   └── Dockerfile
├── .gitignore
└── README.md
```

## Getting started

### Prerequisites

- Java 17 or newer
- Node.js 20 or newer
- PostgreSQL
- Maven 3.9+ or the included Maven wrapper
- Razorpay test credentials

### 1. Clone the repository

```bash
git clone <repository-url>
cd djeccom
```

### 2. Configure the backend

Use [`eccom-backend/.env.example`](eccom-backend/.env.example) as the list of
required settings:

| Variable | Required | Purpose |
| --- | --- | --- |
| `DB_URL` | Yes | PostgreSQL JDBC connection URL |
| `DB_USERNAME` | Yes | PostgreSQL username |
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `CORS_ALLOWED_ORIGINS` | Yes | Comma-separated frontend origins |
| `RZP_TEST_KEY` | Yes | Razorpay test key ID |
| `KEY_SECRET` | Yes | Razorpay test key secret |
| `JWT_SECRET` | Production | JWT signing secret containing at least 32 bytes |
| `JWT_EXPIRATION_MINUTES` | No | Access-token lifetime; defaults to `60` |
| `ADMIN_BOOTSTRAP_ENABLED` | No | Enables first-admin creation |
| `ADMIN_EMAIL` | When bootstrapping | Initial administrator email |
| `ADMIN_PASSWORD` | When bootstrapping | Initial administrator password; minimum 12 characters |
| `ADMIN_NAME` | No | Initial administrator display name |
| `PORT` | No | HTTP port; defaults to `8080` |

Spring Boot does not automatically load a `.env` file during direct local
execution. Export these values in your shell or add them to your IDE run
configuration.

Example for PowerShell:

```powershell
$env:DB_URL="jdbc:postgresql://localhost:5432/eccom"
$env:DB_USERNAME="postgres"
$env:DB_PASSWORD="your-password"
$env:CORS_ALLOWED_ORIGINS="http://localhost:5173"
$env:RZP_TEST_KEY="your-test-key"
$env:KEY_SECRET="your-test-secret"
```

Run the backend:

```powershell
cd eccom-backend
.\mvnw.cmd spring-boot:run
```

The API starts at `http://localhost:8080`.

### 3. Configure and run the frontend

Create `eccom-frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8080
```

Install dependencies and start Vite:

```bash
cd eccom-frontend
npm install
npm run dev
```

The storefront starts at `http://localhost:5173`.

## Initial administrator

To create the first administrator, temporarily configure:

```env
ADMIN_BOOTSTRAP_ENABLED=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password
ADMIN_NAME=Store Administrator
```

The bootstrap runs only when no `ADMIN` user exists. Disable
`ADMIN_BOOTSTRAP_ENABLED` and remove `ADMIN_PASSWORD` from the deployment
environment after the account has been created.

Users must sign in again after a role change so their new JWT contains the
updated role.

## Main API routes

| Method and path | Access | Purpose |
| --- | --- | --- |
| `POST /user/signup` | Public | Register a customer |
| `POST /user/login` | Public | Authenticate and receive a JWT |
| `GET /product` | Public | List active products |
| `POST /payment/create-order` | Authenticated | Create a Razorpay order |
| `POST /payment/verify` | Authenticated | Verify payment and create an order |
| `GET /orders/history` | Authenticated | View the current user's orders |
| `/admin/products/**` | Admin | Manage and archive products |
| `/admin/users/**` | Admin | View users and assign roles |
| `GET /admin/audit-logs` | Admin | View recent audit events |
| `/admin/orders/**` | Staff | Inspect orders and manage permitted transitions |

Authenticated calls use:

```http
Authorization: Bearer <access-token>
```

## Testing and quality checks

Backend tests use an isolated H2 database and do not access the configured
PostgreSQL instance:

```powershell
cd eccom-backend
.\mvnw.cmd test
```

Frontend checks:

```bash
cd eccom-frontend
npm run lint
npm run build
```

## Docker

Build the backend image from the repository root:

```bash
docker build -t djcorner-api ./eccom-backend
```

Run it with production settings:

```bash
docker run --rm \
  --env-file ./eccom-backend/.env \
  -e SPRING_PROFILES_ACTIVE=prod \
  -p 8080:8080 \
  djcorner-api
```

The `.env` file is ignored by Git. Never copy real credentials into
`.env.example` or commit them to the repository.

## Deploying the backend on Render

Create a Docker web service with `eccom-backend` as the root directory. Add all
required variables from the environment table in Render's environment
settings, including:

```env
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=<strong-random-secret-with-at-least-32-bytes>
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

Render supplies `PORT` automatically. `server.port=${PORT:8080}` allows the
same image to run both locally and on Render.

For multiple frontend deployments, provide comma-separated origins without
paths or trailing slashes:

```env
CORS_ALLOWED_ORIGINS=https://store.example.com,https://admin.example.com
```

## Security notes

- Never commit database, JWT, payment, or administrator credentials.
- Use a different JWT secret for each environment.
- Rotate any credential that has appeared in source control or build logs.
- Use HTTPS for every production frontend and API origin.
- Keep Razorpay secret keys on the backend only.

## Roadmap

- Razorpay webhook verification
- Refresh tokens and session revocation
- Password reset and email verification
- OpenAPI/Swagger documentation
- Pagination, filtering, and product search
- Inventory reservation and concurrency protection
- Integration tests with PostgreSQL and Testcontainers
- Metrics, tracing, and production health endpoints

## Contributing

Contributions are welcome. Create a focused branch, include tests for backend
changes, run the frontend quality checks, and open a pull request describing
the behavior and validation performed.
