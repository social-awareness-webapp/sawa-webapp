This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Production deploys run through GitHub Actions when code is pushed to `main` (including when a PR is merged). The workflow is [`.github/workflows/deploy-production.yml`](.github/workflows/deploy-production.yml).

### One-time setup

1. Import this repository in the [Vercel dashboard](https://vercel.com/new) (or link an existing Vercel project).
2. In the Vercel project, set these **Production** environment variables (see [`.env.example`](.env.example)):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
3. Create a Vercel token at [Account Tokens](https://vercel.com/account/tokens).
4. In the GitHub repo, add these Actions secrets:
   - `VERCEL_TOKEN` — the token from step 3
   - `VERCEL_ORG_ID` — from the Vercel project (or `.vercel/project.json` `orgId` after `vercel link`)
   - `VERCEL_PROJECT_ID` — from the Vercel project (or `.vercel/project.json` `projectId`)

After that, every merge to `main` triggers a production deployment via GitHub Actions.

[`vercel.json`](vercel.json) skips Vercel’s own Git builds on `main` so they do not race the Actions deploy (that race is what stalls the CLI on `Building…`). Preview deploys for other branches still run through Vercel Git.
