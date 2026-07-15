# SAWA-57 — Production smoke tests

End-to-end smoke coverage against a **deployed** SAWA environment (not localhost).

## What it checks

**Public (always)**

| Flow | Assertion |
|------|-----------|
| Homepage | Loads, hero + featured + how-it-works, no Supabase/crash error |
| Login / register | Forms render |
| Auth gate | `/dashboard` and `/admin` redirect to `/login` when logged out |
| Bad login | Invalid credentials show an error |
| Campaign detail | Opens an approved campaign from the homepage when one exists |

**Authenticated (requires `SMOKE_USER_*` in `.env`)**

| Flow | Assertion |
|------|-----------|
| Login | Session created; storage saved for later tests |
| Role home | `/login` redirects to `/admin` or `/dashboard` |
| Admin console | Overview → Pending → All Campaigns → Users → Business Accounts |
| User dashboard | Dashboard → My Campaigns → Profile (when smoke user is not admin) |
| Sign out | Session cleared; `/dashboard` redirects to `/login` again |

## Run

Put credentials in `.env` (gitignored):

```bash
SMOKE_BASE_URL=https://sawa-webapp-six.vercel.app
SMOKE_USER_EMAIL=admin@sawa.app
SMOKE_USER_PASSWORD=your-password
```

```bash
npx playwright install chromium   # first time only
npm run test:smoke
```

Shell overrides still work if you prefer not to use `.env`.

Report:

```bash
npm run test:smoke:report
```

Config: [`playwright.smoke.config.ts`](../playwright.smoke.config.ts) · Specs: [`tests/smoke/`](../tests/smoke/)
