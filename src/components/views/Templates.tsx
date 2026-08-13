import { useApp } from "@/lib/app-context";
import { TEMPLATES } from "@/lib/templates";
import type { Quotation } from "@/lib/quotation";
import { money } from "@/lib/quote-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/views/EmptyState";
import { LayoutTemplate, ArrowRight, FileText } from "lucide-react";

export function Templates() {
  const { startNew, profile } = useApp();
  const c = profile.currency || "USD";

  function useTemplate(q: Quotation) {
    startNew(q);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="label-caps">Starting points</p>
        <h1 className="mt-1 font-display text-4xl">Templates</h1>
        <p className="mt-2 text-ink-soft">
          Jump-start any quote with a proven structure. Tweak everything afterwards.
        </p>
      </div>

      {TEMPLATES.length === 0 ? (
        <EmptyState icon={LayoutTemplate} title="No templates" description="Templates will appear here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((t) => {
            const built = t.build();
            return (
              <Card key={t.id} className="flex flex-col transition-shadow hover:shadow-sheet">
                <CardContent className="flex flex-1 flex-col p-5">
                  <p className="label-caps text-accent">{t.tagline}</p>
                  <h3 className="mt-2 font-display text-xl">{t.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">{t.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-ink-soft">
                      {built.pricing.length} line{built.pricing.length === 1 ? "" : "s"}
                    </span>
                    <span className="font-medium">
                      from {money(Math.min(...built.pricing.map((p) => p.amount)), c)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => useTemplate(built)}
                  >
                    Use template <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-paper-line py-6 text-sm text-ink-soft">
        <FileText className="h-4 w-4" /> Need something custom? Start from a blank quote.
      </div>
    </div>
  );
}
