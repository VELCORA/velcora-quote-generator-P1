import type { ReactNode } from "react";
import type { Quotation } from "@/lib/quotation";
import type { CompanyProfile } from "@/lib/quote-store";
import { money } from "@/lib/quote-store";
import { cn } from "@/lib/utils";

type Props = {
  quote: Quotation;
  profile: CompanyProfile;
  number: string;
  editable?: boolean;
  onChange?: (next: Quotation) => void;
};

function Edit({
  value,
  editable,
  onCommit,
  className,
  multiline,
}: {
  value: string;
  editable: boolean;
  onCommit: (next: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  if (!editable) return <span className={className}>{value}</span>;
  return (
    <span
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onCommit(e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      className={cn(
        "-mx-1 rounded-sm px-1 outline-none ring-offset-2 transition-colors",
        "hover:bg-accent/10 focus:bg-accent/10 focus:ring-2 focus:ring-accent/40",
        className,
      )}
    >
      {value}
    </span>
  );
}

export function QuoteSheet({ quote, profile, number, editable = false, onChange }: Props) {
  const c = quote.currency || profile.currency || "USD";
  const set = (patch: Partial<Quotation>) => onChange?.({ ...quote, ...patch });
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const setList = (key: "scope" | "outOfScope" | "terms", i: number, v: string) => {
    const next = [...quote[key]];
    next[i] = v;
    set({ [key]: next } as Partial<Quotation>);
  };

  return (
    <article className="print-sheet rounded-xl border border-paper-line bg-paper p-8 text-ink shadow-sheet sm:p-12">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-paper-line pb-6">
        <div className="flex items-center gap-3">
          {profile.logo && (
            <img
              src={profile.logo}
              alt={`${profile.companyName || "Company"} logo`}
              className="h-11 w-auto object-contain"
            />
          )}
          <div>
            <p className="font-display text-xl leading-tight">
              {profile.companyName || "Your Company"}
            </p>
            <p className="text-xs text-ink-soft">
              {[profile.tagline, profile.email, profile.phone].filter(Boolean).join(" · ") ||
                "Quotation"}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-ink-soft">
          <p className="label-caps">Quotation</p>
          <p className="mt-1 font-medium text-ink">{number}</p>
          <p className="mt-1">{today}</p>
        </div>
      </header>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="label-caps">Prepared for</p>
          <p className="mt-1 text-sm font-medium">
            <Edit
              editable={editable}
              value={quote.clientName}
              onCommit={(v) => set({ clientName: v })}
            />
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.1]">
            <Edit
              editable={editable}
              value={quote.projectTitle}
              onCommit={(v) => set({ projectTitle: v })}
            />
          </h2>
        </div>
        <div className="text-right">
          <p className="label-caps">Total</p>
          <p className="font-display text-3xl">{money(quote.total, c)}</p>
        </div>
      </div>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">
        <Edit
          multiline
          editable={editable}
          value={quote.executiveSummary}
          onCommit={(v) => set({ executiveSummary: v })}
        />
      </p>

      <Section title="Scope of work">
        <ul className="space-y-2.5 text-sm">
          {quote.scope.map((item, i) => (
            <li key={`${item}-${i}`} className="flex gap-3">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
              <Edit editable={editable} value={item} onCommit={(v) => setList("scope", i, v)} />
            </li>
          ))}
        </ul>
      </Section>

      {quote.outOfScope.length > 0 && (
        <Section title="Not included">
          <ul className="space-y-2.5 text-sm text-ink-soft">
            {quote.outOfScope.map((item, i) => (
              <li key={`${item}-${i}`} className="flex gap-3">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-paper-line" />
                <Edit
                  editable={editable}
                  value={item}
                  onCommit={(v) => setList("outOfScope", i, v)}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Deliverables">
        <div className="grid gap-px overflow-hidden rounded-lg border border-paper-line bg-paper-line sm:grid-cols-2">
          {quote.deliverables.map((d, i) => (
            <div key={`${d.title}-${i}`} className="print-avoid-break bg-paper p-4">
              <p className="text-sm font-medium">
                <Edit
                  editable={editable}
                  value={d.title}
                  onCommit={(v) => {
                    const next = [...quote.deliverables];
                    next[i] = { ...next[i]!, title: v };
                    set({ deliverables: next });
                  }}
                />
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                <Edit
                  multiline
                  editable={editable}
                  value={d.description}
                  onCommit={(v) => {
                    const next = [...quote.deliverables];
                    next[i] = { ...next[i]!, description: v };
                    set({ deliverables: next });
                  }}
                />
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Timeline">
        <ol className="space-y-5 border-l border-paper-line pl-5">
          {quote.timeline.map((t, i) => (
            <li key={`${t.phase}-${i}`} className="print-avoid-break relative">
              <span className="absolute -left-[23px] top-1.5 size-2 rounded-full bg-accent" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">
                  <Edit
                    editable={editable}
                    value={t.phase}
                    onCommit={(v) => {
                      const next = [...quote.timeline];
                      next[i] = { ...next[i]!, phase: v };
                      set({ timeline: next });
                    }}
                  />
                </p>
                <p className="text-xs text-ink-soft">
                  <Edit
                    editable={editable}
                    value={t.duration}
                    onCommit={(v) => {
                      const next = [...quote.timeline];
                      next[i] = { ...next[i]!, duration: v };
                      set({ timeline: next });
                    }}
                  />
                </p>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                <Edit
                  multiline
                  editable={editable}
                  value={t.details}
                  onCommit={(v) => {
                    const next = [...quote.timeline];
                    next[i] = { ...next[i]!, details: v };
                    set({ timeline: next });
                  }}
                />
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section title="Investment">
        <table className="w-full text-sm">
          <tbody>
            {quote.pricing.map((p, i) => (
              <tr key={`${p.item}-${i}`} className="border-b border-paper-line align-top">
                <td className="py-3 pr-4">
                  <p className="font-medium">
                    <Edit
                      editable={editable}
                      value={p.item}
                      onCommit={(v) => {
                        const next = [...quote.pricing];
                        next[i] = { ...next[i]!, item: v };
                        set({ pricing: next });
                      }}
                    />
                  </p>
                  <p className="text-ink-soft">
                    <Edit
                      multiline
                      editable={editable}
                      value={p.description}
                      onCommit={(v) => {
                        const next = [...quote.pricing];
                        next[i] = { ...next[i]!, description: v };
                        set({ pricing: next });
                      }}
                    />
                  </p>
                </td>
                <td className="py-3 text-right font-medium whitespace-nowrap">
                  {editable ? (
                    <input
                      type="number"
                      value={p.amount}
                      onChange={(e) => {
                        const next = [...quote.pricing];
                        next[i] = { ...next[i]!, amount: Number(e.target.value) };
                        set({ pricing: next });
                      }}
                      className="w-28 rounded-sm border border-paper-line bg-paper px-2 py-1 text-right outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  ) : (
                    money(p.amount, c)
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td className="py-2 pr-4 text-right text-ink-soft">Subtotal</td>
              <td className="py-2 text-right whitespace-nowrap">{money(quote.subtotal, c)}</td>
            </tr>
            {quote.taxAmount > 0 && (
              <tr>
                <td className="py-2 pr-4 text-right text-ink-soft">{quote.taxLabel || "Tax"}</td>
                <td className="py-2 text-right whitespace-nowrap">{money(quote.taxAmount, c)}</td>
              </tr>
            )}
            <tr className="border-t border-ink">
              <td className="py-3 pr-4 text-right font-medium">Total</td>
              <td className="py-3 text-right font-display text-xl whitespace-nowrap">
                {money(quote.total, c)}
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="Payment schedule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-line text-left text-ink-soft">
              <th className="label-caps py-2 font-normal">Milestone</th>
              <th className="label-caps py-2 font-normal">Due</th>
              <th className="label-caps py-2 pl-3 text-right font-normal">Share</th>
              <th className="label-caps py-2 pl-4 text-right font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quote.paymentSchedule.map((p, i) => (
              <tr key={`${p.milestone}-${i}`} className="border-b border-paper-line">
                <td className="py-2.5 pr-3">
                  <Edit
                    editable={editable}
                    value={p.milestone}
                    onCommit={(v) => {
                      const next = [...quote.paymentSchedule];
                      next[i] = { ...next[i]!, milestone: v };
                      set({ paymentSchedule: next });
                    }}
                  />
                </td>
                <td className="py-2.5 pr-3 text-ink-soft">
                  <Edit
                    editable={editable}
                    value={p.due}
                    onCommit={(v) => {
                      const next = [...quote.paymentSchedule];
                      next[i] = { ...next[i]!, due: v };
                      set({ paymentSchedule: next });
                    }}
                  />
                </td>
                <td className="py-2.5 text-right">{p.percentage}%</td>
                <td className="py-2.5 text-right whitespace-nowrap">{money(p.amount, c)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="Terms & conditions">
        <ul className="space-y-2.5 text-sm text-ink-soft">
          {quote.terms.map((item, i) => (
            <li key={`${item}-${i}`} className="flex gap-3">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-paper-line" />
              <Edit editable={editable} value={item} onCommit={(v) => setList("terms", i, v)} />
            </li>
          ))}
        </ul>
      </Section>

      <footer className="mt-12 flex flex-wrap items-end justify-between gap-8 border-t border-paper-line pt-6 text-sm">
        <div className="max-w-sm text-ink-soft">
          <p>
            This quotation is valid for {quote.validityDays} days from {today}.
          </p>
          {profile.footerNote && <p className="mt-2">{profile.footerNote}</p>}
          {profile.address && <p className="mt-2 text-xs">{profile.address}</p>}
        </div>
        <div className="w-56">
          <div className="h-10 border-b border-ink" />
          <p className="mt-2 text-xs text-ink-soft">Authorised signature</p>
        </div>
      </footer>
    </article>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h3 className="label-caps">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}
