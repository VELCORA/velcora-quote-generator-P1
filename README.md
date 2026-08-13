<h1 align="center">Velcora Quote Generator</h1>

<div align="center">
  Turn a one-line client brief into a polished, branded, print-ready quotation — in seconds.
</div>

---

## What it is

Velcora Quote Generator is a quoting tool for agencies and freelancers. A business owner describes a project in plain language, and the tool produces a clean, branded quotation with scope, deliverables, timeline, pricing, payment schedule, and terms — ready to send to a client.

## Who it's for

- Freelancers and solo consultants who send quotes every day
- Agencies that need consistent, on-brand pricing documents
- Sales teams that want to stop rebuilding quotes from scratch

## What it does for your business

- **AI drafting** — describe the project in plain language and receive a structured quote (scope, deliverables, timeline, pricing, payment schedule, terms).
- **Inline editing** — click any figure on the sheet to adjust it; totals and tax recalculate automatically.
- **Company profile** — store your logo, business name, contact details and tax preset once; reused on every quote.
- **Local history** — past quotes are saved in the browser so they can be reopened or edited later.
- **Share & export** — print to PDF, or send via WhatsApp / email.

## Why it matters

Preparing a quotation by hand can take an hour or more. Velcora Quote Generator reduces that to a few minutes, keeps every quote consistent with the business's brand, and removes calculation errors — so more time goes to winning work, not writing documents.

## Launch & Deployment

The product is a web application built with Vite + React and deployed on Vercel. A Google Gemini API key enables the AI drafting feature; everything else works without it.

### Deploy on Vercel (recommended)

1. Push this repo to GitHub.
2. In Vercel: **New Project → Import** the repo (Vercel auto-detects Vite).
3. Add the environment variable `GEMINI_API_KEY` (free key: https://aistudio.google.com/apikey).
4. Click **Deploy**.

### Run locally

```sh
npm install
npm run dev
```

### Optional — server-side quote storage (Supabase)

By default quotes are saved in the browser (localStorage). To enable server-side storage:

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

3. In Vercel, add environment variables (Production + Preview):
   - `SUPABASE_URL` = https://YOURPROJECT.supabase.co
   - `SUPABASE_SERVICE_ROLE` = service_role key (Project Settings → API)
4. Redeploy. The app auto-detects the backend and switches from localStorage to Supabase.

> `SUPABASE_SERVICE_ROLE` bypasses RLS and is used ONLY inside the serverless function — never expose it in the browser.

## Technical notes

- **Frontend:** Vite + React 19 + TypeScript + Tailwind CSS v4
- **AI:** Google Gemini, called from a Vercel serverless function (`api/draft.ts`)

## Brand

Velcora is an AI automation brand. Quote Generator is a flagship product for agencies and freelancers. Logo and name are property of Velcora.

---

<p align="center">Built by Velcora — quote faster. look sharper.</p>
