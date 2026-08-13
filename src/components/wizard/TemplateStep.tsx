import { TEMPLATES } from "@/lib/templates";
import type { Quotation } from "@/lib/quotation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function TemplateStep({ onSelect }: { onSelect: (q: Quotation) => void }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-6">
        <p className="label-caps text-accent">Step 1 of 3</p>
        <h2 className="mt-1 font-display text-3xl">Choose a starting point</h2>
        <p className="mt-2 text-ink-soft">
          Pick a template to pre-fill scope, pricing and terms. You can tweak everything after.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <Card key={t.id} className="flex flex-col transition-shadow hover:shadow-sheet">
            <CardContent className="flex flex-1 flex-col p-5">
              <p className="label-caps text-accent">{t.tagline}</p>
              <h3 className="mt-2 font-display text-xl">{t.name}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{t.description}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => onSelect(t.build())}
              >
                Use template <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
