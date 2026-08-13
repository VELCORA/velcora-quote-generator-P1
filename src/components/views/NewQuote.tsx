import * as React from "react";
import { LivePreview } from "@/components/quote/LivePreview";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { getQuoteStore } from "@/lib/store-provider";
import { emptyQuotation, computeTotals, draftQuote, type Quotation } from "@/lib/quotation";
import type { QuoteStatus, SavedQuote } from "@/lib/storage-types";
import { useIsMobile } from "@/hooks/use-mobile";
import { uid } from "@/lib/clients-store";
import { TemplateStep } from "@/components/wizard/TemplateStep";
import { BriefStep } from "@/components/wizard/BriefStep";
import { ReviewStep } from "@/components/wizard/ReviewStep";

type Step = "template" | "brief" | "review";

export function NewQuote() {
  const { wizard, clearWizard, profile, setView, refreshQuotes, toast } = useApp();
  const initial = wizard;
  const isMobile = useIsMobile();

  const [step, setStep] = React.useState<Step>("template");
  const [draft, setDraft] = React.useState<Quotation>(() => emptyQuotation());
  const [status, setStatus] = React.useState<QuoteStatus>("draft");
  const [generating, setGenerating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);

  const [editId] = React.useState<string | null>(initial?.edit?.id ?? null);
  const [createdAt] = React.useState<string | null>(initial?.edit?.createdAt ?? null);
  const [quoteId] = React.useState<string>(() => initial?.edit?.id ?? uid());
  const editing = !!editId;

  const number = `Q-${quoteId.slice(0, 6).toUpperCase()}`;

  React.useEffect(() => {
    if (initial?.edit) {
      setDraft(initial.edit.quotation);
      setStatus(initial.edit.status);
      setStep("brief");
    } else if (initial?.seed) {
      setDraft(initial.seed);
      setStep("brief");
    } else {
      setDraft(emptyQuotation());
      setStep("template");
    }
    clearWizard();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<Quotation>) =>
    setDraft((prev) => computeTotals({ ...prev, ...patch }, profile));

  async function handleDraft(brief: string) {
    if (!brief.trim()) {
      toast("Enter a brief first");
      return;
    }
    setGenerating(true);
    try {
      const q = await draftQuote(brief, profile);
      setDraft(q);
      toast("Draft generated — tweak as needed");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Draft failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const saved: SavedQuote = {
        id: quoteId,
        status,
        createdAt: createdAt ?? now,
        updatedAt: now,
        quotation: draft,
      };
      const store = getQuoteStore();
      await store.save(saved);
      await refreshQuotes();
      toast(editing ? "Quote updated" : "Quote saved");
      setView("quotes");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Stepper step={step} />

      {step === "template" && (
        <TemplateStep
          onSelect={(q) => {
            setDraft(q);
            setStep("brief");
          }}
        />
      )}

      {step === "brief" && (
        <>
          <div className="no-print mb-4 flex items-center justify-between gap-2">
            <button
              onClick={() => setStep("template")}
              className="text-sm text-ink-soft hover:text-foreground"
            >
              ← Templates
            </button>
            <Button size="sm" onClick={() => setStep("review")}>
              Continue to review →
            </Button>
          </div>

          {isMobile ? (
            <div>
              <div className="no-print mb-3 flex gap-2">
                <Button
                  variant={!showPreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  Edit
                </Button>
                <Button
                  variant={showPreview ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPreview(true)}
                >
                  Preview
                </Button>
              </div>
              {showPreview ? (
                <LivePreviewLocal />
              ) : (
                <BriefStepLocal />
              )}
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <BriefStepLocal />
              <LivePreviewLocal />
            </div>
          )}
        </>
      )}

      {step === "review" && (
        <ReviewStep
          draft={draft}
          profile={profile}
          number={number}
          status={status}
          onStatus={setStatus}
          onSave={handleSave}
          onBack={() => setStep("brief")}
          saving={saving}
          editing={editing}
        />
      )}
    </div>
  );

  function BriefStepLocal() {
    return (
      <BriefStep
        draft={draft}
        onChange={update}
        profile={profile}
        onDraft={handleDraft}
        generating={generating}
      />
    );
  }

  function LivePreviewLocal() {
    return (
      <LivePreview
        quote={draft}
        profile={profile}
        number={number}
        editable
        onChange={update}
        className="lg:sticky lg:top-20"
      />
    );
  }
}

function Stepper({ step }: { step: Step }) {
  const items: { key: Step; label: string }[] = [
    { key: "template", label: "Template" },
    { key: "brief", label: "Details" },
    { key: "review", label: "Review" },
  ];
  const activeIndex = items.findIndex((i) => i.key === step);
  return (
    <div className="no-print mb-8 flex items-center gap-2">
      {items.map((it, i) => (
        <React.Fragment key={it.key}>
          <div className="flex items-center gap-2">
            <span
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold " +
                (i <= activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "border border-paper-line text-ink-soft")
              }
            >
              {i + 1}
            </span>
            <span
              className={
                "text-sm " + (i === activeIndex ? "font-medium text-foreground" : "text-ink-soft")
              }
            >
              {it.label}
            </span>
          </div>
          {i < items.length - 1 && <span className="h-px w-6 bg-paper-line" />}
        </React.Fragment>
      ))}
    </div>
  );
}
