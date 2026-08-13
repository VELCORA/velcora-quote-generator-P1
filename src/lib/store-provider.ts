import type { QuoteStore } from "./storage-types";
import { LocalQuoteStore } from "./local-quote-store";
import { ServerQuoteStore } from "./server-quote-store";

/**
 * Proxy store: starts on LocalQuoteStore and upgrades to ServerQuoteStore
 * once we know the backend is configured (via /api/quotes/health).
 * Never throws — falls back to local if the health check fails.
 */
class ProbeQuoteStore implements QuoteStore {
  backed = false;
  private target: QuoteStore = new LocalQuoteStore();

  constructor() {
    void this.probe();
  }

  private async probe(): Promise<void> {
    try {
      const r = await fetch("/api/quotes/health", { method: "GET" });
      const data = (await r.json().catch(() => ({}))) as { backed?: boolean };
      if (r.ok && data.backed) {
        this.target = new ServerQuoteStore();
        this.backed = true;
      }
    } catch {
      /* stay local */
    }
  }

  list() {
    return this.target.list();
  }
  get(id: string) {
    return this.target.get(id);
  }
  save(q: Parameters<QuoteStore["save"]>[0]) {
    return this.target.save(q);
  }
  remove(id: string) {
    return this.target.remove(id);
  }
}

let instance: QuoteStore | null = null;

export function getQuoteStore(): QuoteStore {
  if (!instance) instance = new ProbeQuoteStore();
  return instance;
}
