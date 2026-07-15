# SAWA — Network Design Document

**Ticket:** SAWA-61  
**Product:** SAWA (Social Awareness Web App)  
**Scope:** Final network design and migration strategy  
**Related:**
- [Final Product Document](./final-product.md) (SAWA-60)
- [Smoke tests](./smoke-tests.md) (SAWA-57)
- Deploy workflow: [`.github/workflows/deploy-production.yml`](../.github/workflows/deploy-production.yml)

**Current production edge:** `https://sawa-webapp-six.vercel.app`  
**Backend platform:** Supabase project (Auth, Postgres, Storage) at `NEXT_PUBLIC_SUPABASE_URL`

---

## 1. Purpose

This document records the **final network design** for SAWA as deployed on managed cloud services (Vercel + Supabase + GitHub), and a **migration strategy** from local development to production-ready networking (including optional custom domain and staging separation).

SAWA does **not** run a self-managed VPC, load balancer, or bare-metal CDN. Network design here means:

- Public HTTPS ingress
- Service-to-service trust boundaries
- Auth / cookie / callback flows
- DNS and TLS ownership
- How environments are isolated (or intentionally shared)

---

## 2. Final network design

### 2.1 Logical network diagram

```
                         Internet (users / admins)
                                    │
                                    │ HTTPS :443
                                    ▼
                    ┌───────────────────────────────┐
                    │  Vercel Edge / Anycast        │
                    │  TLS termination              │
                    │  Host: *.vercel.app           │
                    │  (optional custom domain)     │
                    └───────────────┬───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │  Next.js application          │
                    │  • Static / RSC               │
                    │  • Middleware (auth gates)    │
                    │  • Route Handlers (/api,…)    │
                    └───────────────┬───────────────┘
                                    │
              HTTPS to Supabase API (project URL)
                                    │
                    ┌───────────────▼───────────────┐
                    │  Supabase Cloud               │
                    │  ┌─────────┐ ┌──────────────┐ │
                    │  │ Auth    │ │ Postgres     │ │
                    │  └─────────┘ └──────────────┘ │
                    │  ┌─────────┐                  │
                    │  │ Storage │                  │
                    │  └─────────┘                  │
                    └───────────────────────────────┘

  Deploy plane (separate from user traffic):

  Developer → GitHub (git/https) → GitHub Actions → Vercel API (deploy)
```

### 2.2 Trust boundaries

| Boundary | Inside | Outside | Controls |
|----------|--------|---------|----------|
| **B1 — Public web** | Vercel app | Internet | TLS; HTTP→HTTPS by Vercel; app middleware for routes |
| **B2 — App → Supabase** | Next server / browser | Supabase API | Publishable key (browser); server uses same URL/key via SSR cookies; service role only on trusted runtimes |
| **B3 — Deploy plane** | GitHub Actions | Vercel | `VERCEL_TOKEN` + org/project IDs (GitHub Secrets) |
| **B4 — Admin ops** | Operators | Supabase / Vercel dashboards | Org SSO / 2FA (provider-managed) |

There is **no** private peering between Vercel and Supabase. Traffic is encrypted on the public internet to Supabase’s HTTPS endpoints (standard SaaS pattern).

### 2.3 Ingress & DNS

| Item | Current design |
|------|----------------|
| Public hostname | `sawa-webapp-six.vercel.app` (Vercel-managed DNS + cert) |
| Protocol | HTTPS only (Vercel issues and renews certificates) |
| Ports | 443 public; no custom ports exposed by the app |
| CDN / edge | Vercel global edge network |
| Custom domain | **Optional future** — attach in Vercel + update Supabase Auth redirect URLs |

### 2.4 Egress & dependencies

From the **browser** (user device):

| Destination | Purpose |
|-------------|---------|
| Vercel origin / edge | HTML, JS, RSC payloads, API routes |
| `*.supabase.co` (project URL) | Auth, PostgREST, Realtime (if used), Storage |

From the **Next.js server** (Vercel runtime):

| Destination | Purpose |
|-------------|---------|
| Supabase API | Server-side auth session, queries, storage ops in Route Handlers / RSC |

From **CI** (GitHub-hosted runners):

| Destination | Purpose |
|-------------|---------|
| `github.com` | Checkout |
| `api.vercel.com` / Vercel registry | Deploy |
| npm registry | Install during Vercel build (on Vercel builders) |

### 2.5 Application traffic flows

#### A. Anonymous browse

1. Client → `GET /` (Vercel).
2. Server/client may call Supabase for approved campaigns.
3. Response returns over same HTTPS session to the user.

#### B. Login (email/password)

1. Client → `/login` → Supabase Auth `signInWithPassword` (browser → Supabase).
2. Session cookies set for the app origin (via `@supabase/ssr` patterns).
3. Middleware (`src/lib/middleware/app-middleware.ts`) reads cookies on later requests and enforces `/dashboard`, `/admin`, `/campaigns/new` access.

#### C. OAuth (Google) callback path

1. Client starts OAuth with `redirectTo = {origin}/auth/callback?next=…` ([`LoginContainer`](../src/containers/LoginContainer.tsx)).
2. Identity provider → Supabase → redirect to app `/auth/callback`.
3. Route Handler exchanges `code` for session ([`src/app/auth/callback/route.ts`](../src/app/auth/callback/route.ts)), then redirects to `/dashboard` or `/admin`.

**Network requirement:** Supabase Auth **Redirect URLs** allowlist must include:

- `http://localhost:3000/auth/callback`
- `https://sawa-webapp-six.vercel.app/auth/callback`
- Future custom domain callback URL

#### D. Protected API / form posts

1. Authenticated browser → Vercel Route Handler (e.g. `POST /campaigns`).
2. Handler uses server Supabase client (cookie session) → Postgres/Storage.
3. JSON response back to browser.

#### E. Deploy

1. `git push` → GitHub.
2. Actions runner authenticates to Vercel API with token.
3. Vercel builders pull source, build Next.js, publish deployment; edge routing updated.

### 2.6 Security controls (network-relevant)

| Control | Implementation |
|---------|----------------|
| TLS everywhere | Vercel + Supabase HTTPS |
| Session binding | Auth cookies scoped to app origin |
| Route protection | Middleware redirects unauthenticated/unauthorized users |
| Secret surface | No service-role key in `NEXT_PUBLIC_*` |
| CORS | Same-origin app routes; browser talks to Supabase with allowed origins configured in Supabase dashboard |
| Upload surface | Storage URLs only for authorized uploads via app services |

### 2.7 What this design does *not* include

- Customer-managed VPC / private subnets  
- Self-hosted reverse proxy (nginx/Envoy)  
- IP allowlists on the public app (unless added later in Vercel/WAF)  
- Cross-region multi-master DB  
- Dedicated staging Vercel project (recommended in migration, not mandatory today)

---

## 3. Environment network profiles

| Profile | App host | Supabase | Notes |
|---------|----------|----------|--------|
| **Local** | `localhost:3000` | Shared or personal project | Auth callback must allow localhost |
| **Production** | Vercel prod alias | Production Supabase project | Single source of truth for live users/data |
| **Staging (target)** | Separate Vercel project or preview | Separate Supabase project | Prevents smoke/test data polluting prod |

Today, smoke tests may target **production** with dedicated smoke user accounts. Network-wise that is fine; data-wise staging isolation is preferred long-term (see §4).

---

## 4. Migration strategy

Migration here means moving from **developer-laptop–centric** operation to a **stable cloud edge**, then optionally to **custom domain + staging**.

### Phase 0 — Baseline (complete)

| Step | Status |
|------|--------|
| App runs on Next.js + Supabase | Done |
| Production host on Vercel | Done |
| CI deploy on `main` via GitHub Actions | Done |
| Production env vars for Supabase public keys | Done (verify in Vercel dashboard) |
| Auth redirect URLs include prod callback | **Verify** in Supabase Auth settings |

**Exit criteria:** Production URL loads; login works; smoke suite can pass against prod.

### Phase 1 — Harden production networking (1–3 days)

| Step | Action | Owner |
|------|--------|-------|
| 1.1 | Confirm Supabase **Site URL** = production origin | Eng |
| 1.2 | Allowlist exact callback URLs (localhost + prod + www if used) | Eng |
| 1.3 | Enable GitHub/Vercel org 2FA where available | Ops |
| 1.4 | Rotate any leaked tokens (Git remotes, old PATs) | Eng |
| 1.5 | Document production hostname in [final-product.md](./final-product.md) | Eng |
| 1.6 | Ensure Deployment Protection settings don’t break CI/smoke (or document password protection exceptions) | Eng |

**Exit criteria:** OAuth + password auth work from prod; no redirects to wrong origin.

### Phase 2 — Custom domain (optional, 1–2 days)

| Step | Action |
|------|--------|
| 2.1 | Choose domain (e.g. `app.sawa.example`) |
| 2.2 | Add domain in Vercel; complete DNS (A/CNAME) at registrar |
| 2.3 | Wait for Vercel TLS certificate **Ready** |
| 2.4 | Update Supabase Auth Site URL + Redirect URLs to the new origin |
| 2.5 | Update `SMOKE_BASE_URL` / docs / marketing links |
| 2.6 | Keep old `*.vercel.app` as redirect or retire after cutover |

**Rollback:** Point DNS back / keep Vercel alias live; revert Auth Site URL.

### Phase 3 — Staging network isolation (recommended, 2–5 days)

| Step | Action |
|------|--------|
| 3.1 | Create **staging** Supabase project (separate DB/Auth/Storage) |
| 3.2 | Create Vercel **Preview** env or second Vercel project for `develop` / PRs |
| 3.3 | Point Preview/staging env vars at staging Supabase |
| 3.4 | Allowlist staging callback URLs in **staging** Supabase only |
| 3.5 | Run smoke against staging URL; keep production smoke rare or read-only |
| 3.6 | Seed staging with `tests/smoke/seed-accounts.mjs` (service role on staging only) |

**Exit criteria:** Feature work and destructive smoke never require writing to production Auth/DB.

### Phase 4 — Observability & edge controls (ongoing)

| Step | Action |
|------|--------|
| 4.1 | Vercel Analytics / logs for 4xx/5xx spikes |
| 4.2 | Supabase Auth + API logs review |
| 4.3 | Optional: Vercel WAF / bot protection if abuse appears |
| 4.4 | Optional: restrict Supabase dashboard access by org policy |

---

## 5. Cutover checklist (custom domain example)

Use when executing Phase 2:

- [ ] DNS records created with low TTL beforehand (e.g. 300s)
- [ ] Vercel domain shows **Valid Configuration** + certificate issued
- [ ] Supabase redirect allowlist updated **before** announcing the new URL
- [ ] Spot-check: `/`, `/login`, `/auth/callback`, `/dashboard` after login
- [ ] Google OAuth (if enabled) client authorized domains updated
- [ ] Smoke: `SMOKE_BASE_URL=https://<new-domain> npm run test:smoke`
- [ ] Update final product + user manuals

---

## 6. Failure modes & responses

| Symptom | Likely network/auth cause | Response |
|---------|---------------------------|----------|
| Login loop / bounce to `/login` | Cookies blocked; wrong Site URL; middleware | Check Auth Site URL vs browser origin; cookie Secure/SameSite |
| OAuth “redirect URI mismatch” | Callback not allowlisted | Add exact `/auth/callback` URL in Supabase (+ IdP) |
| App loads but “URL and Key required” | Missing `NEXT_PUBLIC_*` at **build** time | Set Vercel env; redeploy without stale cache |
| CI deploy hangs / fails auth | Bad `VERCEL_TOKEN` / org / project | Rotate token; confirm secrets |
| CORS errors to Supabase | Origin not allowed | Add origin in Supabase API settings |
| Mixed content | `http://` asset on `https://` page | Serve assets via HTTPS only |

---

## 7. Decision record (final design)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | Vercel | Native Next.js; TLS/DNS/edge out of the box |
| Data/Auth | Supabase SaaS | Fast delivery; managed Postgres + Auth + Storage |
| CI | GitHub Actions → Vercel CLI | Controllable prod deploys on `main` |
| Private networking | Not used | Unnecessary for current scale; SaaS HTTPS is enough |
| Staging DB | Shared prod today → dedicated later | Phase 3 migration |

---

## 8. Document control

| Field | Value |
|-------|-------|
| Ticket | SAWA-61 |
| Version | 1.0 |
| Audience | Engineering, DevOps, reviewers |
| Status | Final design for current SaaS topology; migration Phases 1–3 recommended |

*Update this document when the production hostname, custom domain, or staging project changes.*
