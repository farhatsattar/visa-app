# Worldwide Visa Adviser Backend

Production-ready NestJS backend with fully automated MLM referral engine (4-level), JWT auth, MongoDB persistence, cron-based expiry, reward/rank automation, and Swagger docs.

## Core Automation

- Registration with referral code auto-links parent and stores up to 4 ancestors.
- Points distribution auto-runs at join:
  - Level 1 = +5
  - Level 2 = +2
  - Level 3 = +1
  - Level 4 = +1
- Unverified user referral points stay pending and auto-expire after 10 days.
- Admin verification activates all pending points automatically.
- Every points/referral update auto-triggers reward eligibility and rank recalculation.

## Tech Stack

- NestJS + Node.js
- MongoDB + Mongoose
- JWT auth + bcrypt
- EventEmitter2 for event automation
- Nest Schedule (cron jobs)
- Swagger API docs

## Setup

```bash
npm install
cp .env.example .env
```

Set required env values in `.env`:

- `PORT` (default `4000`)
- `MONGO_URI`
- `JWT_SECRET` (use a long random secret in production)
- `CORS_ORIGINS` (your frontend domains, comma-separated)
- `TRUST_PROXY` (`true` when behind reverse proxy/load balancer)
- `ENABLE_SWAGGER_IN_PROD` (`false` recommended)

## Run

```bash
npm run start:dev
```

- API base: `http://localhost:4000/api/v1`
- Swagger: `http://localhost:4000/docs`

## Production Notes

- Set `NODE_ENV=production`.
- Keep Swagger disabled in production unless explicitly needed.
- Restrict `CORS_ORIGINS` to real frontend domains only.
- Never commit real `.env` values; commit only `.env.example`.
- Build/start commands:

```bash
npm run build
npm run start:prod
```

## Seed

```bash
npm run seed
```

Creates default admin:

- Email: `admin@visa.local`
- Password: `admin123`

## Main APIs

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me/dashboard` (JWT user)
- `GET /api/v1/admin/users` (JWT admin)
- `PATCH /api/v1/admin/users/:id/verify` (JWT admin)

## Data Collections

- `users`
- `pointshistories`
- `rewards`
- `rankhistories`
