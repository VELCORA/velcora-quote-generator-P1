import type { ReactNode } from "react";
import type { Quotation } from "@/lib/quotation";
import type { CompanyProfile } from "@/lib/quote-store";
import type { QuoteStatus } from "@/lib/storage-types";
import { LivePreview } from "@/components/quote/LivePreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { money } from "@/lib/quote-store";
import { Check, ChevronLeft } from "lucide-react";

const STATUSES: QuoteStatus[] = ["draft", "sent", "accepted", "declined"];

export function ReviewStep({
  draft,
  profile,
  number,
  status,
  onStatus,
  onSave,
  onBack,
  saving,
  editing,
}: {
  draft: Quotation;
  profile: CompanyProfile;
  number: string;
  status: QuoteStatus;
  onStatus: (s: QuoteStatus) => void;
  onSave: () => void;
  onBack: () => void;
  saving: boolean;
  editing: boolean;
}) {
  const c = draft.currency || profile.currency || "USD";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-accent">Step 3 of 3</p>
          <h2 className="mt-1 font-display text-3xl">Review &amp; save</h2>
          <p className="mt-2 text-ink-soft">
            Confirm the details, set a status, then save or send.
          </p>
        </div>
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> Back
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="label-caps">Client</p>
                <p className="mt-1 font-medium">{draft.clientName || "—"}</p>
              </div>
              <div>
                <p className="label-caps">Project</p>
                <p className="mt-1 font-medium">{draft.projectTitle || "—"}</p>
              </div>
              <div>
                <p className="label-caps">Total</p>
                <p className="mt-1 font-display text-2xl">{money(draft.total, c)}</p>
              </div>
              <div>
                <LabelLocal>Status</LabelLocal>
                <select
                  value={status}
                  onChange={(e) => onStatus(e.target.value as QuoteStatus)}
                  className="mt-1 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full" onClick={onSave} disabled={saving}>
            {saving ? (
              "Saving…"
            ) : (
              <>
                <Check className="h-4 w-4" /> {editing ? "Update quote" : "Save quote"}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-ink-soft">
            Saved quotes stay on this device unless a backend is connected.
          </p>
        </div>

        <LivePreview quote={draft} profile={profile} number={number} />
      </div>
    </div>
  );
}

function LabelLocal({ children }: { children: ReactNode }) {
  return <p className="label-caps">{children}</p>;
}
