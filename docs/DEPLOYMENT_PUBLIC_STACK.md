# Public Deployment Stack

## Chosen split

- `apps/web` deploy separately from `apps/api`
- `apps/web` target: **Netlify**
- `apps/api` target: **Railway**
- Postgres target: **Neon Postgres**
- Redis target: **Upstash Redis**
- file storage target: **Cloudflare R2**

## Why split deploys

- The web app is mostly static and benefits from Vercel edge/CDN delivery
- The API needs long-lived process support, Prisma connectivity, Redis, and webhook handling
- Operational isolation keeps frontend shipping fast while backend services mature independently

## Current decision

- Netlify for `apps/web`
- Railway for `apps/api`
- Neon for Postgres
- Upstash for Redis
- Cloudflare R2 for media and hero assets

## Revenue-critical public contract

Public routes must load without auth and provide capture paths for buyer/seller/dealer traffic:

- `/`
- `/inventory`
- `/inventory/[id]`
- `/sell`
- `/appraisal`
- `/contact`
- `/pricing` (or `/dealer/pilot`)

Public visitors should not be forced to login before expressing interest.

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
9. Run public production smoke:
   `PUBLIC_SITE_URL=https://vortex-exotics.netlify.app NEXT_PUBLIC_API_URL=https://<api-origin> PUBLIC_SMOKE_TENANT_ID=<tenant-id> pnpm run public:smoke`

## Required production env

### apps/web

```env
NEXT_PUBLIC_SITE_URL=https://vortex-exotics.netlify.app
NEXT_PUBLIC_API_URL=https://your-live-api-url
NEXT_PUBLIC_CONTACT_EMAIL=real@email.com
NEXT_PUBLIC_CONTACT_PHONE=+1...
NEXT_PUBLIC_HERO_VIDEO_URL=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
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

## Release blockers (public)

Block marketing/public deploys when any are true:

- Anonymous lead/contact intake fails.
- Contact phone/email are missing or placeholder-only.
- Public pages show `Not configured` / fake contact copy.
- Mobile hero does not expose a primary CTA.
- Inventory cards/images fail to render.
