export type CompanyProfile = {
  companyName: string;
  tagline?: string;
  email?: string;
  phone?: string;
  logo?: string;
  address?: string;
  footerNote?: string;
  currency: string;
  taxLabel?: string;
  taxRate?: number;
};

export function money(amount: number, currency = "USD"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
}

const PROFILE_KEY = "velcora.profile";
const HISTORY_KEY = "velcora.quotes";

const DEFAULT_PROFILE: CompanyProfile = {
  companyName: "Velcora",
  tagline: "AI automation studio",
  email: "hello@velcora.ai",
  currency: "USD",
  taxLabel: "Tax",
  taxRate: 0,
};

export function loadProfile(): CompanyProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(p: CompanyProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function loadHistory<T = unknown>(): T[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function saveQuote(q: unknown): unknown[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    const next = [q, ...list].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}
