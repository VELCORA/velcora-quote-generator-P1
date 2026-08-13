import type { Quotation } from "./quotation";
import type { QuoteStore, SavedQuote } from "./storage-types";

interface Row {
  id: string;
  data: SavedQuote;
  created_at?: string;
}

function mapRow(row: Row): SavedQuote {
  const d = row.data || ({} as SavedQuote);
  return {
    id: row.id || d.id,
    status: d.status ?? "draft",
    createdAt: d.createdAt || row.created_at || new Date().toISOString(),
    updatedAt: d.updatedAt || row.created_at || new Date().toISOString(),
    quotation: (d.quotation || {}) as Quotation,
  };
}

export class ServerQuoteStore implements QuoteStore {
  backed = true;

  async list(): Promise<SavedQuote[]> {
    try {
      const r = await fetch("/api/quotes", { method: "GET" });
      if (!r.ok) return [];
      const rows = (await r.json()) as Row[];
      return Array.isArray(rows) ? rows.map(mapRow) : [];
    } catch {
      return [];
    }
  }

  async get(id: string): Promise<SavedQuote | null> {
    const all = await this.list();
    return all.find((q) => q.id === id) ?? null;
  }

  async save(q: SavedQuote): Promise<void> {
    try {
      await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q),
      });
    } catch {
      /* ignore network errors */
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await fetch(`/api/quotes?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {
      /* ignore network errors */
    }
  }
}
