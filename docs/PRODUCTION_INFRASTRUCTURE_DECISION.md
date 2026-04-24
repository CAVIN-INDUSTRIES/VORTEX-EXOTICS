# Production Infrastructure Decision

## Chosen stack

- `apps/web` -> **Vercel**
- `apps/api` -> **Railway**
- Postgres -> **Neon**
- Redis -> **Upstash**
- media / cinematic assets -> **Cloudflare R2**

## Target architecture

```text
Vercel (apps/web)
        |
        v
Railway (apps/api)
        |
        +--> Neon Postgres
        +--> Upstash Redis
        +--> Cloudflare R2
```

## Immediate priority order

1. Buy the production domain
2. Create the Vercel project for `apps/web`
3. Create the Railway service for `apps/api`
4. Create the Neon database
5. Create the Upstash Redis instance
6. Create the Cloudflare R2 bucket
7. Set real production env variables
8. Deploy web
9. Deploy API
10. Test contact and appraisal against the live API
11. Seed premium inventory and cinematic assets
12. Launch beta

## Real values required before launch

```env
NEXT_PUBLIC_SITE_URL=https://vexdomain.com
NEXT_PUBLIC_API_URL=https://api.vexdomain.com
```

## Provisioning references

- web env template: [apps/web/.env.production.example](../apps/web/.env.production.example)
- api env template: [apps/api/.env.production.example](../apps/api/.env.production.example)
- platform checklist: [docs/PLATFORM_PROVISIONING_CHECKLIST.md](PLATFORM_PROVISIONING_CHECKLIST.md)
- Railway service config: [railway.json](../railway.json)
- Vercel env setup: [docs/VERCEL_ENV_SETUP.md](VERCEL_ENV_SETUP.md)
- Railway env setup: [docs/RAILWAY_ENV_SETUP.md](RAILWAY_ENV_SETUP.md)
- launch sequence: [docs/PRODUCTION_LAUNCH_SEQUENCE.md](PRODUCTION_LAUNCH_SEQUENCE.md)
