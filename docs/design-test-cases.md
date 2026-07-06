# SAWA Design Test Cases (SAWA-36)

Manual and automated design verification for all Figma Make prototype screens implemented in the webapp.

**Figma reference:** `App.tsx` screen IDs (`S0_Homepage`, `S1_Login`, registration wizard steps, campaign detail)

**Design system tokens**

| Token | Value | Tailwind / usage |
|-------|-------|------------------|
| Primary (navy) | `#1A365D` | `bg-primary`, headings, primary buttons |
| Secondary (blue) | `#2B6CB0` | Links, stats strip, focus rings |
| Accent (gold) | `#D69E2E` | CTA buttons, badges, step numbers |
| Foreground | `#2D3748` | Body headings, labels |
| Muted text | `slate-500` | Subtitles, helper text |
| Page background | `bg-slate-50` | Auth flows |
| Card | white, `rounded-xl`, `border-slate-100`, `shadow-sm` | All form/detail cards |
| Success teal | `#2C9E9E` | Completed stepper, confirmation icon |
| Font | Inter | Root layout |

**Breakpoints to verify:** 375px (mobile), 768px (tablet), 1280px (desktop)

**First-time setup**

```bash
npx playwright install
```

**Run tests** (start or reuse `npm run dev` on port 3000 first)

```bash
npm run test:design
```

If auth redirect tests fail after middleware changes, restart the dev server so `src/middleware.ts` is picked up.

---

## Screen index

| Screen ID | Prototype name | Route | Auth |
|-----------|----------------|-------|------|
| S0 | Homepage | `/` | Public |
| S1 | Login | `/login` | Public |
| S2a | Register — Choose Role | `/register` (step 1) | Public |
| S2b | Register — Your Details | `/register` (step 2) | Public |
| S2c | Register — Confirmed | `/register` (step 3) | Public |
| S3 | Campaign Detail | `/campaigns/[slug]` | Required |

---

## Global components

### G1 — PublicNavbar (S0, S3)

| # | Test case | Steps | Expected result | Pass |
|---|-----------|-------|-----------------|------|
| G1.1 | Logo branding | Open `/` | Megaphone icon + bold "SAWA" in `#1A365D`, links to `/` | ☐ |
| G1.2 | Desktop nav links | View at ≥768px | "Campaigns" and "How It Works" anchor links visible | ☐ |
| G1.3 | Logged-out actions | Visit while signed out | "Sign In" (ghost) + "Get Started" (navy) buttons | ☐ |
| G1.4 | Logged-in actions | Sign in, return to `/` | "Sign In" replaced by "Log Out"; "Get Started" hidden | ☐ |
| G1.5 | Sticky header | Scroll homepage | Navbar stays fixed, white bg, bottom border `slate-100` | ☐ |

### G2 — AuthNavbar (S1)

| # | Test case | Steps | Expected result | Pass |
|---|-----------|-------|-----------------|------|
| G2.1 | Logo | Open `/login` | Same SAWA logo as public navbar | ☐ |
| G2.2 | Back link | Check top-right | "← Back to Home" in `slate-500`, links to `/` | ☐ |

### G3 — RegisterNavbar (S2)

| # | Test case | Steps | Expected result | Pass |
|---|-----------|-------|-----------------|------|
| G3.1 | Logo | Open `/register` | SAWA logo left | ☐ |
| G3.2 | Sign-in prompt | Check top-right | "Already have an account? **Sign in →**" (`#2B6CB0`) | ☐ |

---

## S0 — Homepage (`/`)

**Layout:** `bg-white min-h-screen` + PublicNavbar

### Hero (`#1A365D` background)

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S0.1 | Gold pill badge | Megaphone icon + "Community-Powered Awareness" on gold-tinted pill | ☐ |
| S0.2 | Headline | "Amplify Causes That Matter in Your Community" — `text-4xl font-bold` white | ☐ |
| S0.3 | Subtext | White/80 opacity paragraph, max-width ~xl | ☐ |
| S0.4 | Primary CTA | "Explore Campaigns" gold button + ArrowRight icon → `#featured-campaigns` | ☐ |
| S0.5 | Secondary CTA | "Start a Campaign" white outline button → `/register` | ☐ |
| S0.6 | Hero image (desktop) | `homepage_hero.png` visible at lg+, right-aligned beside copy | ☐ |

### Stats strip (`#2B6CB0`)

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S0.7 | Four stats | 2,400+ Community Members · 141 Active Campaigns · 38 Partner Businesses · 12,000+ Lives Reached | ☐ |
| S0.8 | Typography | Bold white values, muted white labels | ☐ |

### Featured Campaigns

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S0.9 | Section header | "Featured Campaigns" + "View All →" link (`#2B6CB0`) | ☐ |
| S0.10 | Subtext | "Reviewed and approved by SAWA administrators." | ☐ |
| S0.11 | Category pills | All, Environment, Health, Education, Community — active pill navy | ☐ |
| S0.12 | Filter behaviour | Click "Health" — only Health campaigns shown | ☐ |
| S0.13 | Campaign grid | 3 columns at lg, cards with image placeholder, category pill, title, org, description, progress bar | ☐ |
| S0.14 | Learn More CTA | Full-width navy "Learn More" per card → `/campaigns/[slug]` | ☐ |

### How It Works (`bg-slate-50`)

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S0.15 | Three cards | Numbered gold badges: Create an Account, Submit a Campaign, Spread Awareness | ☐ |
| S0.16 | Icons | UserPlus, FileText, Megaphone respectively | ☐ |

### CTA + Footer

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S0.17 | CTA section | Blue bg, "Ready to Make a Difference?", gold "Get Started Free" → `/register` | ☐ |
| S0.18 | CTA subtext | "No credit card required. Always free for community members." | ☐ |
| S0.19 | Footer | Navy `#1A365D`, 4 columns: branding + © 2026, Quick Links, For Organisations, Legal | ☐ |

---

## S1 — Login (`/login`)

**Layout:** `bg-slate-50 min-h-screen` + AuthNavbar + centered card `max-w-md`

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S1.1 | Card header | 48×48 navy/10 circle with Lock icon; "Welcome Back" `text-3xl`; subtitle slate-500 | ☐ |
| S1.2 | Separator | Full-width divider below header | ☐ |
| S1.3 | Email field | Label "Email Address *", placeholder `you@example.com` | ☐ |
| S1.4 | Password field | Label "Password *", show/hide Eye toggle, `pr-10` input | ☐ |
| S1.5 | Forgot password | Right-aligned link → `/forgot-password` (`#2B6CB0`, text-xs) | ☐ |
| S1.6 | Sign In button | Full-width navy primary, `py-2.5` | ☐ |
| S1.7 | OAuth divider | "— or continue with —" centered on separator | ☐ |
| S1.8 | Google button | Outline, Globe icon, "Continue with Google" | ☐ |
| S1.9 | Footer link | "Don't have an account?" + "Join SAWA →" → `/register` | ☐ |
| S1.10 | Error state | Failed login shows red Alert with XCircle + message above form | ☐ |
| S1.11 | Success banner | `/login?registered=true` shows green Alert with CheckCircle2 | ☐ |
| S1.12 | Loading state | Submit shows "Signing in..." disabled button | ☐ |

---

## S2a — Register Step 1: Choose Role (`/register`)

**Layout:** RegisterNavbar + stepper + card `max-w-lg`

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S2a.1 | Stepper | Step 1 active (navy circle "1"), steps 2–3 inactive gray | ☐ |
| S2a.2 | Card title | "How will you use SAWA?" navy bold | ☐ |
| S2a.3 | Subtitle | "Select the role that best describes you." | ☐ |
| S2a.4 | Community Member card | User icon, title, description; selectable with navy border on select | ☐ |
| S2a.5 | Business Owner card | Briefcase icon, selectable | ☐ |
| S2a.6 | Admin card | Shield icon, grayed out, not clickable, "Invite only" copy | ☐ |
| S2a.7 | Continue button | Disabled (slate) until role selected; enabled navy "Continue →" after selection | ☐ |

---

## S2b — Register Step 2: Your Details

**Precondition:** Complete S2a with Community Member selected

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S2b.1 | Stepper | Step 1 teal checkmark, step 2 active navy, step 3 gray | ☐ |
| S2b.2 | Card title | "Create Your Account" | ☐ |
| S2b.3 | Role subtitle | "Signing up as a **Community Member**" (or selected role) | ☐ |
| S2b.4 | Name fields | First Name + Last Name side-by-side on sm+ | ☐ |
| S2b.5 | Email field | Full width, placeholder `you@example.com` | ☐ |
| S2b.6 | Password field | Placeholder mentions min 8 chars | ☐ |
| S2b.7 | Strength meter | 4-segment bar appears on typing; "Fair" orange label at partial strength | ☐ |
| S2b.8 | Confirm password | Matching validation error if mismatch | ☐ |
| S2b.9 | Terms checkbox | Links to Terms of Service + Privacy Policy (`#2B6CB0`) | ☐ |
| S2b.10 | Actions | "← Back" outline + "Create Account" navy (wider) side by side | ☐ |
| S2b.11 | Error state | API failure shows red Alert with XCircle inline in card | ☐ |

---

## S2c — Register Step 3: Confirmed

**Precondition:** Successful registration submission

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S2c.1 | Stepper | Steps 1–2 teal checkmarks, step 3 active navy | ☐ |
| S2c.2 | Success icon | Large teal circle with white checkmark | ☐ |
| S2c.3 | Title | "Account Created!" | ☐ |
| S2c.4 | Personalised copy | Welcome with **first name** and **email** in bold | ☐ |
| S2c.5 | Resend link | "Didn't receive it? Resend verification email" (`#2B6CB0`) | ☐ |
| S2c.6 | Dashboard CTA | Full-width "Go to Dashboard →" navy button → `/` | ☐ |

---

## S3 — Campaign Detail (`/campaigns/[slug]`)

**Precondition:** User signed in (middleware redirects otherwise)

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| S3.1 | Auth gate | Logged-out visit redirects to `/login?redirect=...` | ☐ |
| S3.2 | PublicNavbar | Same navbar as homepage when authenticated | ☐ |
| S3.3 | Back link | "← Back to campaigns" → `/#featured-campaigns` | ☐ |
| S3.4 | Hero image | `h-56` placeholder with category badge top-left | ☐ |
| S3.5 | Title + org | Campaign title bold; "By {organization}" with User icon | ☐ |
| S3.6 | Description | Full description text visible | ☐ |
| S3.7 | Progress | Blue progress bar + "{n}% of goal · {days} days left" | ☐ |

---

## Cross-cutting design checks

| # | Area | Test case | Expected result | Pass |
|---|------|-----------|-----------------|------|
| X1 | Typography | All screens | Inter font, headings `#2D3748` bold | ☐ |
| X2 | Form inputs | Auth screens | `rounded-lg border-slate-200`, focus ring `#2B6CB0`/30 | ☐ |
| X3 | Links | All screens | `#2B6CB0` with underline on hover | ☐ |
| X4 | Mobile | 375px width | No horizontal scroll; stacked layouts | ☐ |
| X4 | Tablet | 768px | Register name fields 2-col; homepage 2-col hero | ☐ |
| X5 | Desktop | 1280px | Homepage 3-col campaign grid; hero image visible | ☐ |
| X6 | Accessibility | Interactive elements | Buttons/links keyboard focusable; password toggle has aria-label | ☐ |

---

## Test execution log

| Date | Tester | Build / branch | Screens tested | Issues found |
|------|--------|----------------|----------------|--------------|
| | | | | |

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Design QA | | | |
| Engineering | | | |
| Product | | | |
