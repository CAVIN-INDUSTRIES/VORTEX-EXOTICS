# Public Deployment Stack

## Chosen split

- `apps/web` deploy separately from `apps/api`
- `apps/web` target: **Vercel**
- `apps/api` target: **Railway**
- Postgres target: **Neon Postgres**
- Redis target: **Upstash Redis**
- file storage target: **Cloudflare R2**

## Why split deploys

- The web app is mostly static and benefits from Vercel edge/CDN delivery
- The API needs long-lived process support, Prisma connectivity, Redis, and webhook handling
- Operational isolation keeps frontend shipping fast while backend services mature independently

## Current decision

- Vercel for `apps/web`
- Railway for `apps/api`
- Neon for Postgres
- Upstash for Redis
- Cloudflare R2 for media and hero assets

## Minimum launch checklist

1. `corepack pnpm install`
2. Build shared packages:
   `corepack pnpm --filter @vex/shared run build`
   `corepack pnpm --filter @vex/cinematic run build`
   `corepack pnpm --filter @vex/3d-configurator run build`
   `corepack pnpm --filter @vex/ui run build`
3. Verify web:
   `corepack pnpm --filter @vex/web run lint`
   `corepack pnpm --filter @vex/web run build`
4. Set production env for `apps/web`
5. Set production env for `apps/api`
6. Point `NEXT_PUBLIC_API_URL` to the live API origin
7. Verify contact/appraisal flows against the deployed API
8. Confirm no placeholder URLs or fake contact details remain

## Required production env

### apps/web

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_HERO_VIDEO_URL=
```

### apps/api

```env
DATABASE_URL=
DIRECT_DATABASE_URL=
JWT_SECRET=
REDIS_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
CORS_ORIGIN=
```
