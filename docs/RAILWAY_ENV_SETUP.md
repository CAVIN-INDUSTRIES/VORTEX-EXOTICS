# Railway Environment Setup

Deploy target: `apps/api`

Set these in Railway for Production:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=
DIRECT_DATABASE_URL=
JWT_SECRET=
REDIS_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CORS_ORIGIN=https://vexdomain.com
PUBLIC_WEB_URL=https://vexdomain.com
NEXT_PUBLIC_API_URL=https://api.vexdomain.com
RESEND_API_KEY=
RESEND_FROM=concierge@vexdomain.com
INTERNAL_PILOT_METRICS_KEY=
```

Likely-needed production extras:

```env
EDMUNDS_API_KEY=
EDMUNDS_SECRET=
MARKETCHECK_API_KEY=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_BASE_URL=https://media.vexdomain.com
```

Important:

- `CORS_ORIGIN` must be the real web origin, not `*`
- `DATABASE_URL` should be the pooled Neon connection
- `DIRECT_DATABASE_URL` should be the direct Neon connection for Prisma migrations
- `JWT_SECRET` should be a long random secret
- if valuation APIs are required for launch, do not leave the valuation keys blank

Recommended Railway flow:

1. create service from this repo
2. use [railway.json](../railway.json)
3. set env variables
4. run Prisma generate/build during deploy
5. verify `/health`
6. verify `/`

Post-deploy checks:

1. `GET /health`
2. `GET /`
3. `POST /leads`
4. `POST /public/quick-appraisal`
