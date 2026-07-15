# SAWA-57 — Production smoke tests

End-to-end smoke coverage against a **deployed** SAWA environment (not localhost).

## What it checks

**Public** — homepage, login/register, auth gates, bad login, campaign detail  

**Admin** (`SMOKE_ADMIN_*` or legacy `SMOKE_USER_*`) — console navigation + sign out  

**Community** (`SMOKE_COMMUNITY_*`) — dashboard + post campaign (submit + draft)  

**Business** (`SMOKE_BUSINESS_*`) — dashboard + business campaign form (submit + draft)  

## Credentials in `.env`

```bash
SMOKE_BASE_URL=https://sawa-webapp-six.vercel.app
SMOKE_ADMIN_EMAIL=admin@sawa.app
SMOKE_ADMIN_PASSWORD=...
SMOKE_COMMUNITY_EMAIL=smoke.community@sawa.app
SMOKE_COMMUNITY_PASSWORD=...
SMOKE_BUSINESS_EMAIL=smoke.business@sawa.app
SMOKE_BUSINESS_PASSWORD=...
```

Seed community/business accounts (needs `SUPABASE_SERVICE_ROLE_KEY`):

```bash
SUPABASE_SERVICE_ROLE_KEY=... node tests/smoke/seed-accounts.mjs
```

## Run

```bash
npx playwright install chromium   # first time only
npm run test:smoke
npm run test:smoke:report
```

Projects without credentials are omitted automatically.
