import type { CompanyProfile } from "./quote-store";

export interface Quotation {
  clientName: string;
  projectTitle: string;
  executiveSummary: string;
  currency: string;
  scope: string[];
  outOfScope: string[];
  deliverables: { title: string; description: string }[];
  timeline: { phase: string; duration: string; details: string }[];
  pricing: { item: string; description: string; amount: number }[];
  subtotal: number;
  taxLabel?: string;
  taxRate?: number;
  taxAmount: number;
  total: number;
  paymentSchedule: { milestone: string; due: string; percentage: number; amount: number }[];
  validityDays: number;
}

export function emptyQuotation(): Quotation {
  return {
    clientName: "",
    projectTitle: "",
    executiveSummary: "",
    currency: "USD",
    scope: [],
    outOfScope: [],
    deliverables: [],
    timeline: [],
    pricing: [],
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    paymentSchedule: [],
    validityDays: 14,
  };
}

export function computeTotals(q: Partial<Quotation>, profile: CompanyProfile): Quotation {
  const pricing = q.pricing ?? [];
  const subtotal = pricing.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const taxRate = q.taxRate ?? profile.taxRate ?? 0;
  const taxAmount = Math.round(subtotal * (taxRate / 100));
  const total = subtotal + taxAmount;
  const paymentSchedule = (q.paymentSchedule ?? []).map((p) => ({
    ...p,
    amount: Math.round((total * (p.percentage || 0)) / 100),
  }));

  return {
    clientName: q.clientName ?? "",
    projectTitle: q.projectTitle ?? "",
    executiveSummary: q.executiveSummary ?? "",
    currency: q.currency ?? profile.currency ?? "USD",
    scope: q.scope ?? [],
    outOfScope: q.outOfScope ?? [],
    deliverables: q.deliverables ?? [],
    timeline: q.timeline ?? [],
    pricing,
    subtotal,
    taxLabel: q.taxLabel ?? profile.taxLabel,
    taxRate,
    taxAmount,
    total,
    paymentSchedule,
    validityDays: q.validityDays ?? 14,
  };
}

export async function draftQuote(brief: string, profile: CompanyProfile): Promise<Quotation> {
  const res = await fetch("/api/draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brief, profile }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error || `Draft failed (${res.status})`);
  }

  const data = (await res.json()) as Partial<Quotation>;
  return computeTotals(data, profile);
}
