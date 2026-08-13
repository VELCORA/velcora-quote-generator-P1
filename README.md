# Velcora Quote Generator (P1)

Turn a one-line client brief into a polished, branded, print-ready quotation.

## What it does
- **AI drafting** — describe the project in plain language and get a structured quote (scope, deliverables, timeline, pricing, payment schedule, terms).
- **Inline editing** — click any text or number on the sheet to adjust it; totals and tax recalculate automatically.
- **Company profile** — save your logo, business name, contact details and tax preset; reused for every quote.
- **Local history** — past quotes are stored in your browser so you can reopen or edit them.
- **Share & export** — print to PDF, or share via WhatsApp / email.

## Stack
- Vite + React 19 + TypeScript + Tailwind CSS v4
- AI drafting via a Vercel serverless function (`api/draft.ts`) calling Google Gemini

## Develop
Requires Node.js >= 22.

```sh
npm install
npm run dev
```

## Deploy (Vercel)

The Vite SPA builds to `dist` and `vercel.json` adds the SPA fallback rewrite
(`/(.*)` → `/index.html`). The `api/` folder is auto-detected as serverless
functions — do NOT add a rewrite for `/api/*` (it would clobber them).

### Option A — GitHub import (recommended)
1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** the repo (Vercel auto-detects Vite).
3. Add env var `GEMINI_API_KEY` (free key: https://aistudio.google.com/apikey).
4. Click **Deploy**.

The AI "Generate quote" feature needs `GEMINI_API_KEY`; everything else works without it.

### Option B — Vercel CLI
```sh
npm install -g vercel
vercel login
vercel --prod
```
Set `GEMINI_API_KEY` in the Vercel dashboard (Settings → Environment Variables) or run `vercel env add GEMINI_API_KEY`.

### Optional — Supabase-backed quotes (server storage)
Without this, quotes are saved in the browser (localStorage). To enable server-side storage:
1. Create a free project at https://supabase.com.
2. Run this SQL in the Supabase SQL editor:
```sql
create table quotes (
  id uuid primary key default gen_random_uuid(),
  owner text default 'agency',
  data jsonb not null,
  created_at timestamptz default now()
);
create index if not exists quotes_created_at_idx on quotes (created_at desc);
```
3. In Vercel, add env vars (Production + Preview):
   - `SUPABASE_URL` = https://YOURPROJECT.supabase.co
   - `SUPABASE_SERVICE_ROLE` = service_role key (Project Settings → API)
4. Redeploy. The app auto-detects the backend via `/api/quotes/health` and switches from localStorage to Supabase.

> `SUPABASE_SERVICE_ROLE` bypasses RLS and is used ONLY inside the serverless
> function — never expose it to the browser.
