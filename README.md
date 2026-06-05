# Synapse Sync

AI co-pilot for multi-channel content mastery — optimizing cross-platform content distribution to maximize reach and engagement.

**Live:** [bmai-synapse-sync.pages.dev](https://bmai-synapse-sync.pages.dev)

---

## Stack

- **Frontend:** React + Vite + Tailwind CSS → Cloudflare Pages
- **Backend API:** Cloudflare Worker (Stripe proxy) → `synapse-sync-api.workers.dev`
- **Payments:** Stripe Checkout (14-day trial, Starter $10/mo, Pro $100/mo)

---

## Setup

### 1. Clone & install
```bash
git clone https://github.com/BradAIStar29/synapse-sync
cd synapse-sync
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env` and fill in:
- `VITE_API_URL` — your deployed Worker URL
- `VITE_STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard

### 3. Deploy the Cloudflare Worker (Stripe backend)
```bash
cd worker
npm install -g wrangler
wrangler login
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put VITE_STRIPE_PUBLISHABLE_KEY
wrangler deploy
```
Note the Worker URL — paste it as `VITE_API_URL` in your GitHub repo secrets.

### 4. Deploy frontend (automatic via GitHub Actions)
Add these secrets to your GitHub repo (Settings → Secrets → Actions):
- `CLOUDFLARE_API_TOKEN` — from Cloudflare dashboard (Workers & Pages permission)
- `CLOUDFLARE_ACCOUNT_ID` — from Cloudflare dashboard sidebar
- `VITE_API_URL` — your Worker URL from step 3
- `VITE_STRIPE_PUBLISHABLE_KEY` — from Stripe dashboard

Then push to `main` — GitHub Actions deploys automatically to Cloudflare Pages.

### 5. Local dev
```bash
npm run dev
```
