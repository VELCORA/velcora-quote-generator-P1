// Vercel serverless function — Quotes CRUD backed by Supabase REST (PostgREST).
//
// ── Supabase setup ──────────────────────────────────────────────────────────
// 1. Create a project at https://supabase.com
// 2. Run this SQL in the SQL editor:
//
//    create table quotes (
//      id uuid primary key default gen_random_uuid(),
//      owner text default 'agency',
//      data jsonb not null,
//      created_at timestamptz default now()
//    );
//    create index if not exists quotes_created_at_idx on quotes (created_at desc);
//
// 3. In Vercel, add Environment Variables (Production + Preview):
//      SUPABASE_URL            = https://YOURPROJECT.supabase.co
//      SUPABASE_SERVICE_ROLE   = <service_role key from Project Settings → API>
//
// The service-role key bypasses RLS, so this function is the ONLY place it is
// used. Never expose it to the browser. When both vars are absent the function
// returns 503 { backed: false } and the app falls back to localStorage.
//
// ── API surface ─────────────────────────────────────────────────────────────
//   GET    /api/quotes            -> SavedQuote[]
//   POST   /api/quotes            -> { backed:true, id }   body: SavedQuote
//   DELETE /api/quotes?id=<uuid>  -> { ok:true }

export const config = { runtime: "nodejs22.x", region: "iad1", maxDuration: 45 };

interface SavedQuotePayload {
  id: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  quotation?: unknown;
  [key: string]: unknown;
}

interface Env {
  url: string;
  key: string;
}

function getEnv(): Env | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  return url && key ? { url, key } : null;
}

async function supabase(path: string, init: RequestInit): Promise<Response> {
  const env = getEnv()!;
  return fetch(`${env.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.key,
      Authorization: `Bearer ${env.key}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (!getEnv()) {
    return Response.json(
      { backed: false, error: "Supabase not configured" },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const method = req.method;

  if (method === "GET") {
    try {
      const r = await supabase(
        "quotes?select=id,data,created_at&order=created_at.desc",
        { method: "GET" },
      );
      if (!r.ok) {
        return Response.json({ error: "Failed to load quotes" }, { status: 502 });
      }
      const rows = (await r.json()) as {
        id: string;
        data: SavedQuotePayload;
        created_at?: string;
      }[];
      const list = rows.map((row) => ({
        id: row.id,
        status: (row.data?.status as string) || "draft",
        createdAt: row.data?.createdAt || row.created_at || new Date().toISOString(),
        updatedAt: row.data?.updatedAt || row.created_at || new Date().toISOString(),
        quotation: (row.data?.quotation as object) || {},
      }));
      return Response.json(list);
    } catch {
      return Response.json({ error: "Failed to load quotes" }, { status: 502 });
    }
  }

  if (method === "POST") {
    const body = (await req.json().catch(() => null)) as SavedQuotePayload | null;
    if (!body || !body.id) {
      return Response.json({ error: "Invalid body: id required" }, { status: 400 });
    }
    try {
      const r = await supabase("quotes", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ id: body.id, data: body }),
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        return Response.json({ error: `Save failed: ${detail}` }, { status: 502 });
      }
      return Response.json({ backed: true, id: body.id });
    } catch {
      return Response.json({ error: "Failed to save quote" }, { status: 502 });
    }
  }

  if (method === "DELETE") {
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
    try {
      const r = await supabase(`quotes?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!r.ok) {
        return Response.json({ error: "Failed to delete" }, { status: 502 });
      }
      return Response.json({ ok: true });
    } catch {
      return Response.json({ error: "Failed to delete" }, { status: 502 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
