import type { Quotation } from "./quotation";
import type { QuoteStore, SavedQuote } from "./storage-types";

const KEY = "velcora.quotes";
const CAP = 20;

function read(): SavedQuote[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedQuote[]) : [];
  } catch {
    return [];
  }
}

function write(list: SavedQuote[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, CAP)));
  } catch {
    /* ignore quota errors */
  }
}

export class LocalQuoteStore implements QuoteStore {
  backed = false;

  async list(): Promise<SavedQuote[]> {
    return read();
  }

  async get(id: string): Promise<SavedQuote | null> {
    return read().find((q) => q.id === id) ?? null;
  }

  async save(q: SavedQuote): Promise<void> {
    const list = read();
    const idx = list.findIndex((x) => x.id === q.id);
    if (idx >= 0) list[idx] = q;
    else list.unshift(q);
    write(list);
  }

  async remove(id: string): Promise<void> {
    write(read().filter((q) => q.id !== id));
  }
}
