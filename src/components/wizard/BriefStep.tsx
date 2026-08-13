import * as React from "react";
import type { Quotation } from "@/lib/quotation";
import type { CompanyProfile } from "@/lib/quote-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { QUOTATION_TERMS_HINT } from "@/lib/quotation";
import { Wand2, Plus, Trash2, Loader2 } from "lucide-react";

type StrKey = "scope" | "outOfScope" | "terms";

export function BriefStep({
  draft,
  onChange,
  profile,
  onDraft,
  generating,
}: {
  draft: Quotation;
  onChange: (patch: Partial<Quotation>) => void;
  profile: CompanyProfile;
  onDraft: (brief: string) => void;
  generating: boolean;
}) {
  const [brief, setBrief] = React.useState("");

  const setStr = (key: StrKey, i: number, v: string) => {
    const next = [...draft[key]];
    next[i] = v;
    onChange({ [key]: next } as Partial<Quotation>);
  };
  const addStr = (key: StrKey) => onChange({ [key]: [...draft[key], ""] });
  const removeStr = (key: StrKey, i: number) =>
    onChange({ [key]: draft[key].filter((_, idx) => idx !== i) });

  const setPricing = (i: number, patch: Partial<Quotation["pricing"][number]>) =>
    onChange({ pricing: draft.pricing.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const addPricing = () =>
    onChange({ pricing: [...draft.pricing, { item: "", description: "", amount: 0 }] });
  const removePricing = (i: number) =>
    onChange({ pricing: draft.pricing.filter((_, idx) => idx !== i) });

  const setSchedule = (i: number, patch: Partial<Quotation["paymentSchedule"][number]>) =>
    onChange({
      paymentSchedule: draft.paymentSchedule.map((p, idx) =>
        idx === i ? { ...p, ...patch } : p,
      ),
    });
  const addSchedule = () =>
    onChange({
      paymentSchedule: [
        ...draft.paymentSchedule,
        { milestone: "Deposit", due: "On signing", percentage: 50, amount: 0 },
      ],
    });
  const removeSchedule = (i: number) =>
    onChange({ paymentSchedule: draft.paymentSchedule.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-8">
      <header>
        <p className="label-caps text-accent">Step 2 of 3</p>
        <h2 className="mt-1 font-display text-3xl">Build your quote</h2>
        <p className="mt-2 text-ink-soft">
          Edit the details. The preview updates live on the right.
        </p>
      </header>

      {/* AI draft */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
        <Label className="flex items-center gap-2 text-accent">
          <Wand2 className="h-4 w-4" /> Draft from a brief
        </Label>
        <Textarea
          rows={3}
          className="mt-2"
          placeholder="Describe the project in plain language — the AI fills scope, pricing and terms."
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            disabled={!brief.trim() || generating}
            onClick={() => onDraft(brief)}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            {generating ? "Drafting…" : "Generate with AI"}
          </Button>
        </div>
      </div>

      {/* Client & project */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label>Client name</Label>
          <Input
            value={draft.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Project title</Label>
          <Input
            value={draft.projectTitle}
            onChange={(e) => onChange({ projectTitle: e.target.value })}
          />
        </div>
        <div className="space-y-1 sm:col-span-2">
          <Label>Executive summary</Label>
          <Textarea
            rows={3}
            value={draft.executiveSummary}
            onChange={(e) => onChange({ executiveSummary: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <Label>Validity (days)</Label>
          <Input
            type="number"
            value={draft.validityDays}
            onChange={(e) => onChange({ validityDays: Number(e.target.value) || 0 })}
          />
        </div>
      </section>

      {/* Scope */}
      <section>
        <Label>Scope of work</Label>
        <div className="mt-2 space-y-2">
          {draft.scope.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={s} onChange={(e) => setStr("scope", i, e.target.value)} />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeStr("scope", i)}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => addStr("scope")}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        </div>
      </section>

      {/* Out of scope */}
      <section>
        <Label>Not included (optional)</Label>
        <div className="mt-2 space-y-2">
          {draft.outOfScope.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={s} onChange={(e) => setStr("outOfScope", i, e.target.value)} />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeStr("outOfScope", i)}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => addStr("outOfScope")}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        </div>
      </section>

      {/* Pricing */}
      <section>
        <Label>Investment</Label>
        <div className="mt-2 space-y-2">
          {draft.pricing.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <Input
                  placeholder="Item"
                  value={p.item}
                  onChange={(e) => setPricing(i, { item: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) => setPricing(i, { description: e.target.value })}
                />
              </div>
              <Input
                type="number"
                className="w-28"
                value={p.amount}
                onChange={(e) => setPricing(i, { amount: Number(e.target.value) || 0 })}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removePricing(i)}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addPricing}>
            <Plus className="h-4 w-4" /> Add line
          </Button>
        </div>
      </section>

      {/* Payment schedule */}
      <section>
        <Label>Payment schedule</Label>
        <div className="mt-2 space-y-2">
          {draft.paymentSchedule.map((p, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2">
              <Input
                className="flex-1"
                placeholder="Milestone"
                value={p.milestone}
                onChange={(e) => setSchedule(i, { milestone: e.target.value })}
              />
              <Input
                className="flex-1"
                placeholder="Due"
                value={p.due}
                onChange={(e) => setSchedule(i, { due: e.target.value })}
              />
              <Input
                type="number"
                className="w-24"
                placeholder="%"
                value={p.percentage}
                onChange={(e) => setSchedule(i, { percentage: Number(e.target.value) || 0 })}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeSchedule(i)}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addSchedule}>
            <Plus className="h-4 w-4" /> Add milestone
          </Button>
        </div>
      </section>

      {/* Terms */}
      <section>
        <Label>Terms &amp; conditions</Label>
        <p className="mt-1 text-xs text-ink-soft">{QUOTATION_TERMS_HINT}</p>
        <div className="mt-2 space-y-2">
          {draft.terms.map((t, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={t} onChange={(e) => setStr("terms", i, e.target.value)} />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeStr("terms", i)}
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={() => addStr("terms")}>
            <Plus className="h-4 w-4" /> Add term
          </Button>
        </div>
      </section>
    </div>
  );
}
