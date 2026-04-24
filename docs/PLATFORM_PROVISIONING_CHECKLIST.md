# Platform Provisioning Checklist

## Web: Vercel

Project:

- create a Vercel project pointed at this repo
- set root directory to `apps/web`
- set framework to Next.js

Environment:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `NEXT_PUBLIC_HERO_VIDEO_URL`
- `INTERNAL_PILOT_METRICS_KEY` if investor pilot counters are required

Domain:

- connect the production domain
- set canonical domain before launch

## API: Railway

Project:

- create a Railway service pointed at this repo
- use [railway.json](../railway.json)
- deploy `apps/api`

Environment:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `JWT_SECRET`
- `REDIS_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CORS_ORIGIN`
- `PUBLIC_WEB_URL`

Operational extras:

- `RESEND_API_KEY`
- `RESEND_FROM`
- `INTERNAL_PILOT_METRICS_KEY`

## Database: Neon

- create production database
- create pooled connection for `DATABASE_URL`
- create direct connection for `DIRECT_DATABASE_URL`
- run Prisma migrations before opening traffic

## Redis: Upstash

- create Redis instance
- set `REDIS_URL`

## Media: Cloudflare R2

- create bucket for inventory and cinematic assets
- upload hero video and media
- point `NEXT_PUBLIC_HERO_VIDEO_URL` at the public R2-backed URL

Suggested envs:

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`

## Launch sequence

1. Provision Neon
2. Provision Upstash
3. Provision R2
4. Provision Railway API
5. Provision Vercel web
6. Set env values on both platforms
7. Run API migrations
8. Deploy API
9. Deploy web
10. Test `/contact`
11. Test `/appraisal`
12. Validate live domain, metadata, and hero assets
