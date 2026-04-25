# Visa Adviser Frontend

Next.js 16 frontend for the Visa Adviser platform.

## Setup

```bash
npm install
cp .env.example .env.local
```

Required env values:

- `BACKEND_INTERNAL_URL` (for Next.js rewrites to backend API)

## Development

```bash
npm run dev
```

App runs on `http://localhost:3000`.

## Production

```bash
npm run build
npm run start
```

Deployment notes:

- Set `BACKEND_INTERNAL_URL` to your production backend URL.
- Ensure backend `CORS_ORIGINS` includes your frontend domain.
- Run frontend behind HTTPS-enabled reverse proxy/CDN.
