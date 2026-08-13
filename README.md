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
1. Push this repo to GitHub.
2. In Vercel: New Project → Import the repo (Vercel auto-detects Vite).
3. Add an environment variable: `GEMINI_API_KEY` (get a free key at https://aistudio.google.com/apikey).
4. Deploy.

The AI "Generate quote" feature needs `GEMINI_API_KEY` set; everything else works without it.
