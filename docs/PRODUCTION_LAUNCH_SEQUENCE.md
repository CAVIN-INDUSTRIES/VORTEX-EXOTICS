# Production Launch Sequence

## Order of operations

1. Buy and connect the domain
2. Provision Neon Postgres
3. Provision Upstash Redis
4. Provision Cloudflare R2
5. Provision Railway for `apps/api`
6. Set Railway env vars
7. Run API deploy
8. Verify Railway health endpoints
9. Provision Vercel for `apps/web`
10. Set Vercel env vars
11. Deploy web
12. Verify live web routes
13. Test `contact` and `appraisal` end-to-end
14. Seed premium inventory and media
15. Launch beta

## Smoke checklist

API:

- `/health` returns 200
- `/` returns JSON
- lead submission succeeds
- appraisal submission succeeds

Web:

- homepage hero loads
- contact page submits cleanly
- appraisal page submits cleanly
- inventory renders
- metadata uses production domain

## Live values that must be real

```env
NEXT_PUBLIC_SITE_URL=https://vexdomain.com
NEXT_PUBLIC_API_URL=https://api.vexdomain.com
CORS_ORIGIN=https://vexdomain.com
PUBLIC_WEB_URL=https://vexdomain.com
```
