# AgentHub — docs site

Next.js 15 + Tailwind 4 + shadcn-style components. Deployed on Vercel.

Live GitHub integration pulls releases + repo stats with a 1-hour cache, so the changelog updates automatically after every GitHub Release without a redeploy.

## Local dev

```bash
cd site
npm install
npm run dev
```

Site runs on http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local`. `GITHUB_TOKEN` is optional — without it you have 60 req/hour; with it, 5000.

```bash
cp .env.example .env.local
```

## Deploy to Vercel

1. Push the repo (this is already part of github.com/SKB3002/agenthub — the site lives at `site/`).
2. On [vercel.com](https://vercel.com), click **Add New → Project**.
3. Import the `SKB3002/agenthub` repo.
4. In the project settings, set **Root Directory** to `site`.
5. Framework preset should auto-detect as Next.js.
6. (Optional) Add `GITHUB_TOKEN` env var to raise API rate limits.
7. Click **Deploy**.

That's it. Vercel will build and host it. Subsequent pushes to `main` auto-deploy.

## Structure

```
site/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx              # Landing
│  │  ├─ docs/                 # All docs pages (layout + sidebar)
│  │  ├─ changelog/            # Live from GitHub Releases
│  │  ├─ opengraph-image.tsx   # Dynamic OG
│  │  ├─ sitemap.ts / robots.ts
│  │  └─ layout.tsx            # Root shell + ThemeProvider
│  ├─ components/              # Header, Footer, Tabs, CodeBlock, etc.
│  └─ lib/
│     ├─ data.ts               # Commands, agents, skills catalog
│     ├─ github.ts             # GitHub API wrappers (1h cache)
│     └─ utils.ts
├─ vercel.json
└─ .env.example
```

## Updating content

Most content is static and lives inline in the page files. When you ship a major change, edit the relevant page. When you cut a GitHub Release, the changelog updates itself within an hour (or on next build).

If you want to force a refresh before the 1-hour revalidation fires, redeploy from Vercel's dashboard.
