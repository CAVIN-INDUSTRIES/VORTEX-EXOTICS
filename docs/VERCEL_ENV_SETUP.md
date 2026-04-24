# Vercel Environment Setup

Deploy target: `apps/web`

Set these in Vercel for Production:

```env
NEXT_PUBLIC_SITE_URL=https://vexdomain.com
NEXT_PUBLIC_API_URL=https://api.vexdomain.com
NEXT_PUBLIC_CONTACT_EMAIL=concierge@vexdomain.com
NEXT_PUBLIC_CONTACT_PHONE=+1 (555) 010-9000
NEXT_PUBLIC_HERO_VIDEO_URL=https://media.vexdomain.com/hero/vex-cinematic-loop.mp4
NEXT_PUBLIC_HERO_PARTICLES=true
INTERNAL_PILOT_METRICS_KEY=
```

Notes:

- `NEXT_PUBLIC_SITE_URL` must be the final canonical domain
- `NEXT_PUBLIC_API_URL` must point to the live Railway API origin
- `NEXT_PUBLIC_HERO_VIDEO_URL` should point to a public R2-backed asset URL or remain blank
- `INTERNAL_PILOT_METRICS_KEY` is only needed if `/api/investor/pilot-network` is used in production

Recommended Vercel project settings:

- Root directory: `apps/web`
- Framework preset: `Next.js`
- Node version: `20+`
- Build command: use repo `vercel.json`

Post-deploy checks:

1. open `/`
2. open `/inventory`
3. open `/contact`
4. open `/appraisal`
5. confirm metadata and canonical domain
