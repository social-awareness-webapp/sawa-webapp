# SAWA — Final Product Document

**Ticket:** SAWA-60  
**Product:** SAWA (Social Awareness Web App)  
**Document type:** Final product summary — cloud analysis + screenshots  
**Related docs:**
- [User Manual](./user-manual.md) (SAWA-58) — create if missing
- [Developer Manual](./developer-manual.md) (SAWA-59) — create if missing
- [Smoke tests](./smoke-tests.md) (SAWA-57)
- [Design test cases](./design-test-cases.md)
- [Network Design](./network-design.md) (SAWA-61)

**Production URL:** https://sawa-webapp-six.vercel.app  
*(Update if the team promotes a custom domain.)*

---

## 1. Executive summary

SAWA is a web application that lets **community members** and **small businesses** create social-awareness campaigns, and lets **super admins** review and approve them before they appear publicly.

| Capability | Description |
|------------|-------------|
| Public discovery | Homepage, featured campaigns, campaign detail |
| Community posting | Social campaign create / draft / submit for review |
| Business posting | Branded campaigns with sponsorship tiers |
| Admin review | Pending queue, approve/reject, users, business accounts |
| Auth | Email/password (Supabase Auth); role-based homes |

The product is a **Next.js App Router** frontend hosted on **Vercel**, with **Supabase** providing Auth, Postgres, and Storage. Production deploys are triggered by **GitHub Actions** on pushes to `main`.

---

## 2. Cloud analysis

### 2.1 Cloud architecture

```
┌─────────────────┐     push main      ┌──────────────────┐
│  GitHub         │ ─────────────────▶ │ GitHub Actions   │
│  sawa-webapp    │                    │ Deploy Production│
└─────────────────┘                    └────────┬─────────┘
                                                │ vercel deploy --prod
                                                ▼
                                       ┌──────────────────┐
                                       │ Vercel           │
                                       │ Next.js (Edge/   │
                                       │ Node runtime)    │
                                       └────────┬─────────┘
                    ┌───────────────────────────┼───────────────────────────┐
                    ▼                           ▼                           ▼
             Browser SSR/CSR              Middleware                   Route Handlers
                    │                           │                           │
                    └───────────────────────────┼───────────────────────────┘
                                                ▼
                                       ┌──────────────────┐
                                       │ Supabase Cloud   │
                                       │ • Auth           │
                                       │ • Postgres       │
                                       │ • Storage        │
                                       └──────────────────┘
```

### 2.2 Services inventory

| Service | Provider | Role in SAWA |
|---------|----------|--------------|
| Application hosting | **Vercel** | Builds & serves Next.js; production (+ previews for non-`main` if Git integration is enabled) |
| Source control | **GitHub** | Repo `social-awareness-webapp/sawa-webapp`; CI trigger on `main` |
| CI/CD | **GitHub Actions** | [`.github/workflows/deploy-production.yml`](../.github/workflows/deploy-production.yml) → Vercel CLI prod deploy |
| Auth | **Supabase Auth** | Sign-up, sign-in, session cookies via `@supabase/ssr` |
| Database | **Supabase Postgres** | `users`, `campaigns`, `business_profiles`, etc. |
| File storage | **Supabase Storage** | Campaign banners / logos / documents |
| DNS / TLS | **Vercel** | HTTPS on `*.vercel.app` (custom domain optional) |

### 2.3 Environments

| Environment | URL / trigger | Config |
|-------------|---------------|--------|
| **Local** | `http://localhost:3000` (`npm run dev`) | `.env` with `NEXT_PUBLIC_SUPABASE_*` |
| **Production** | Vercel production alias (e.g. `sawa-webapp-six.vercel.app`) | Vercel Project env + GitHub Actions secrets |
| **Preview** (optional) | Vercel branch/PR URLs | Same Supabase project or a staging project (team choice) |

### 2.4 Deployment pipeline

1. Developer merges / pushes to **`main`**.
2. Workflow **Deploy Production** runs on `ubuntu-latest`.
3. Job uses secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
4. `vercel deploy --prod` builds on Vercel with Production env vars.
5. Successful deploy updates the production URL.

**Required Vercel Production env**

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Inlined at build time for the client |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key — expected to be public in the browser |

After changing these, trigger a **fresh rebuild**, not a cache-only redeploy. Prefer **not** marking `NEXT_PUBLIC_*` as Sensitive on Vercel if CI or tooling uses `vercel pull`.

### 2.5 Security & access (cloud)

| Concern | Approach |
|---------|----------|
| Secrets | GitHub Actions secrets for Vercel; Supabase keys in Vercel env |
| Public keys | `NEXT_PUBLIC_*` are visible to browsers by design |
| Service role | Server/seed only — **never** shipped to the client |
| Authorization | Next middleware + role checks (`user`, `business_owner`, `super_admin`) |
| HTTPS | Terminated at Vercel |

### 2.6 Operational monitoring (lightweight)

| Check | How |
|-------|-----|
| Deploy health | GitHub Actions run + Vercel deployment status |
| App smoke | `npm run test:smoke` against the production URL |
| Auth / DB | Supabase dashboard (Auth users, Table Editor, Logs) |

### 2.7 Cost / scaling notes (summary)

| Layer | Scaling characteristic |
|-------|------------------------|
| Vercel | Serverless; scales with traffic; plan quotas apply |
| Supabase | Project tiers (DB size, Auth MAUs, storage bandwidth) |
| GitHub Actions | Minutes per deploy |

*(Fill exact plan names/tiers used by your org when publishing formally.)*

---

## 3. Product surface (roles → screens)

| Role | Primary screens |
|------|-----------------|
| Visitor | Homepage, Featured Campaigns, Campaign detail, Login, Register |
| Community Member | Dashboard, Post a Campaign, My Campaigns, Profile |
| Business Owner | Same shell + Business Campaign form (branding, tiers, compliance) |
| Super Admin | Admin Overview, Pending Campaigns, All Campaigns, Users, Business Accounts |

**Campaign statuses:** Draft → Pending Review → Approved / Rejected. Only **approved** campaigns appear in public Featured Campaigns.

---

## 4. Screenshots

All screenshots for this document are published in Confluence (source of truth):

**[Social Awareness Web App — Final Product Document](https://fakharolakh4u.atlassian.net/wiki/spaces/SAWA/pages/25231361/Social+Awareness+Web+App+Final+Product+Document)**

See also [`screenshots/README.md`](./screenshots/README.md) for the filename checklist. Optional local PNG copies may be stored under [`docs/screenshots/`](./screenshots/) for GitHub markdown rendering.

> Capture guidance: desktop ~1280–1440px wide. Use role-specific test accounts. Blur secrets in cloud console shots.

### 4.1 Public

| ID | Filename | Capture |
|----|----------|---------|
| S1 | `01-homepage.png` | First viewport — hero “Amplify Causes…”, navbar Sign In / Get Started |
| S2 | `02-featured-campaigns.png` | Featured Campaigns + category pills |
| S3 | `03-campaign-detail.png` | Approved campaign detail |
| S4 | `04-login.png` | Welcome Back / email & password |
| S5 | `05-register-role.png` | “How will you use SAWA?” role step |

<!-- Local images optional — preferred view is the Confluence page linked above.
![S1 Homepage](./screenshots/01-homepage.png)
![S2 Featured campaigns](./screenshots/02-featured-campaigns.png)
![S3 Campaign detail](./screenshots/03-campaign-detail.png)
![S4 Login](./screenshots/04-login.png)
![S5 Register roles](./screenshots/05-register-role.png)
-->

### 4.2 Community member

| ID | Filename | Capture |
|----|----------|---------|
| S6 | `06-dashboard.png` | Signed-in dashboard |
| S7 | `07-post-campaign.png` | “Post a New Campaign” form |
| S8 | `08-my-campaigns.png` | My Campaigns list with statuses |

### 4.3 Business owner

| ID | Filename | Capture |
|----|----------|---------|
| S9 | `09-business-campaign.png` | “Launch a Business Awareness Campaign” + Business Campaign badge |
| S10 | `10-sponsorship-tiers.png` | Sponsorship tiers (Standard / Featured / Premium) |

### 4.4 Super admin

| ID | Filename | Capture |
|----|----------|---------|
| S11 | `11-admin-overview.png` | Admin Overview metrics + charts |
| S12 | `12-pending-campaigns.png` | Pending Campaigns queue |
| S13 | `13-admin-review.png` | Campaign detail with Approve / Reject |
| S14 | `14-user-management.png` | User Management |
| S15 | `15-business-accounts.png` | Business Accounts |

### 4.5 Cloud consoles (recommended for SAWA-60)

| ID | Filename | Capture |
|----|----------|---------|
| C1 | `cloud-vercel-project.png` | Vercel → Deployments (blur tokens) |
| C2 | `cloud-vercel-env.png` | Environment Variables list (blur values) |
| C3 | `cloud-github-actions.png` | Actions → Deploy Production success |
| C4 | `cloud-supabase-overview.png` | Supabase project home (blur sensitive IDs if needed) |

---

## 5. Validation evidence

| Gate | Evidence |
|------|----------|
| Production live | App responds at production URL |
| Deploy automation | Push to `main` → Actions + Vercel deployment |
| Smoke | `npm run test:smoke` (public + role flows when credentials configured) |
| User docs | SAWA-58 User Manual |
| Dev docs | SAWA-59 Developer Manual |

---

## 6. Known limitations / next steps

- Production may still use the default `*.vercel.app` alias until a custom domain is attached.
- Confirm whether Preview deploys share production Supabase or a dedicated staging project.
- Next.js may warn about migrating `middleware` → `proxy` — track as tech debt.
- Do not mark `NEXT_PUBLIC_*` as Sensitive on Vercel if tooling needs to read them at pull/build time.

---

## 7. Document control

| Field | Value |
|-------|-------|
| Ticket | SAWA-60 |
| Version | 1.0 |
| Audience | Stakeholders, demos, new engineers |
| Maintainer | SAWA engineering |

*Screenshots live in the Confluence Final Product Document linked in §4.*
