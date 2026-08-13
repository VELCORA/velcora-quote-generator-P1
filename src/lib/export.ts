import type { Quotation } from "./quotation";
import type { CompanyProfile } from "./quote-store";
import { money } from "./quote-store";

export function printQuote(): void {
  if (typeof window !== "undefined") window.print();
}

function summarize(quote: Quotation, profile: CompanyProfile): string {
  const c = quote.currency || profile.currency || "USD";
  const lines = [
    `${profile.companyName || "Quotation"} — ${quote.projectTitle || "Proposal"}`,
    "",
    quote.executiveSummary || "",
    "",
    `Total: ${money(quote.total, c)}`,
    `Valid for ${quote.validityDays} days.`,
  ];
  return lines.filter(Boolean).join("\n");
}

export function waLink(quote: Quotation, profile: CompanyProfile): string {
  return `https://wa.me/?text=${encodeURIComponent(summarize(quote, profile))}`;
}

export function mailtoQuote(quote: Quotation, profile: CompanyProfile): string {
  const subject = `Quotation — ${quote.projectTitle || "Proposal"}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    summarize(quote, profile),
  )}`;
}
