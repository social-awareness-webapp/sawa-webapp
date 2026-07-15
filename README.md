This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Smoke tests (SAWA-57)

Run Playwright against the deployed app:

```bash
npm run test:smoke
```

Optional authenticated check (also loaded automatically from `.env`):

```bash
SMOKE_USER_EMAIL='...' SMOKE_USER_PASSWORD='...' npm run test:smoke
```

See [docs/smoke-tests.md](docs/smoke-tests.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Production deploys run through GitHub Actions when code is pushed to `main` (including when a PR is merged). The workflow is [`.github/workflows/deploy-production.yml`](.github/workflows/deploy-production.yml).

### One-time setup

1. Import this repository in the [Vercel dashboard](https://vercel.com/new) (or link an existing Vercel project).
2. In the Vercel project (`social-awareness-webapp/sawa-webapp`), set these **Production** environment variables (see [`.env.example`](.env.example)):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   
   Use the same values as local `.env`. Do **not** mark these as Sensitive — they are public client keys, and Sensitive values cannot be used by local/`--prebuilt` builds. After adding or changing them, trigger a **new** deployment (not a cache-only redeploy).
3. Create a Vercel token at [Account Tokens](https://vercel.com/account/tokens).
4. In the GitHub repo, add these Actions secrets:
   - `VERCEL_TOKEN` — the token from step 3
   - `VERCEL_ORG_ID` — from the Vercel project (or `.vercel/project.json` `orgId` after `vercel link`)
   - `VERCEL_PROJECT_ID` — from the Vercel project (or `.vercel/project.json` `projectId`)
   - Optional fallbacks if not set on Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

After that, every merge to `main` triggers a production deployment via GitHub Actions.

[`vercel.json`](vercel.json) skips Vercel’s own Git builds on `main` so they do not race the Actions deploy (that race is what stalls the CLI on `Building…`). Preview deploys for other branches still run through Vercel Git.
