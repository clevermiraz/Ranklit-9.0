# Ranklit

Marketing site + product app for **Ranklit**, an AI local-SEO agent for Google Business Profiles.
Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript and Tailwind CSS v4.

## Getting started

```bash
cp .env.example .env.local   # set SESSION_SECRET (required in production)
npm install
npm run dev                  # http://localhost:3000
```

Demo login (fully populated account): `demo@ranklit.com` / `demo1234`.

## What's inside

| Area | Routes |
| --- | --- |
| Marketing | `/`, `/features`, `/pricing`, `/rank-tracker`, `/local-business`, `/agencies`, `/agencies/pricing`, `/case-studies/[slug]`, `/about`, `/privacy`, `/terms` |
| Content | `/blog`, `/blog/[slug]`, `/blog/tag/[tag]`, `/local-seo`, `/local-seo/[industry]`, `/local-seo/[industry]/[city]` |
| Free tools | `/tools`, `/tools/[slug]` (22 tools) + `POST /api/tools/[slug]` |
| Auth & billing | `/checkout` → `/signup?session_id=…` → `/dashboard`, `/login`, `/forgot-password`, `/reset-password`, `/logout` |
| App | Home `/dashboard` · Rankings (`/dashboard/rankings`, `/scans`, `/ai-visibility`) · Reviews (`/dashboard/reviews`, `/get-reviews`, `/review-widget`) · Google Profile (`/dashboard/gbp`, `/gbp/posts`, `/gbp-insights`, `/gbp-audit`) · Listings (`/dashboard/citations`, `/listings`) · Website (`/dashboard/website`, `/organic-seo`, `/tools`) · Autopilot (`/dashboard/autopilot`, `/settings/automations`, `/dashboard/strategy`) · Add-ons `/dashboard/upgrades` · Settings (`/settings`, `/dashboard/businesses`, `/settings/plans`, `/dashboard/alerts`, `/settings/api`) |
| Public | Customer review page `/review/[slug]`, review widget embed `/api/embed/widget.js` |

## Architecture notes

- `src/app/(marketing)` — public pages sharing the header/footer layout.
- `src/app/(app)` — the logged-in app; its layout renders the shell (sidebar, header with Ctrl+K palette, trial banner, section tabs from `src/lib/app/nav.ts`).
- `src/components/app` — dashboard UI kit (`ui.tsx`, `controls.tsx`, `charts.tsx`) and per-section client components.
- `src/app/actions` — server actions for auth, checkout and dashboard mutations.
- `src/lib/session.ts` — HMAC-signed cookies/tokens (Web Crypto). `src/proxy.ts` guards `/dashboard`.
- `src/lib/pricing.ts` — single source of truth for plans, volume tiers and price math.

### Mock data — what to replace for production

Everything below sits behind a small set of functions, so the UI does not change when you swap it:

| Mock | File | Replace with |
| --- | --- | --- |
| Users (in-memory, resets on restart) | `src/lib/server/users.ts` | A database (e.g. Postgres) |
| Business data (profile, strategy, scans, reviews, posts, insights, citations…) | `src/lib/server/store.ts` (+ `*-store.ts` section modules) | Google Business Profile API, a geo-grid rank-scan provider, your DB |
| Payment step (card is validated client-side only, never sent) | `src/app/actions/checkout.ts`, `src/components/checkout/checkout-form.tsx` | Stripe Checkout / Payment Element + webhooks |
| AI tool results, review replies, post copy (templated) | `src/lib/tools/generate.ts` and the section action files in `src/app/actions/` | An LLM call |
| Password-reset emails | `requestPasswordReset` in `src/app/actions/auth.ts` | An email provider |

Test card at checkout: `4242 4242 4242 4242`, any future expiry, any CVC.
