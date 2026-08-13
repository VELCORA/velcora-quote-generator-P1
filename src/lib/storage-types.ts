import type { Quotation } from "./quotation";

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined";

export interface SavedQuote {
  id: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
  quotation: Quotation;
}

export interface QuoteStore {
  backed: boolean;
  list(): Promise<SavedQuote[]>;
  get(id: string): Promise<SavedQuote | null>;
  save(q: SavedQuote): Promise<void>;
  remove(id: string): Promise<void>;
}
