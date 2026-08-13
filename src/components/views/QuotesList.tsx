import * as React from "react";
import { useApp } from "@/lib/app-context";
import { getQuoteStore } from "@/lib/store-provider";
import { money } from "@/lib/quote-store";
import type { QuoteStatus, SavedQuote } from "@/lib/storage-types";
import { uid } from "@/lib/clients-store";
import { StatusBadge, statusColor } from "@/components/quote/StatusBadge";
import { PrintSheet } from "@/components/quote/PrintSheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/views/EmptyState";
import {
  PlusCircle,
  FileText,
  Copy,
  Trash2,
  Printer,
  Pencil,
  CheckCircle2,
  Clock,
  Send,
  XCircle,
} from "lucide-react";

const FILTERS: { value: "all" | QuoteStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "accepted", label: "Accepted" },
  { value: "declined", label: "Declined" },
];

const STATUS_ICON: Record<
  QuoteStatus,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  draft: Clock,
  sent: Send,
  accepted: CheckCircle2,
  declined: XCircle,
};

export function QuotesList() {
  const { quotes, profile, editQuote, refreshQuotes, startNew, toast } = useApp();
  const [filter, setFilter] = React.useState<string>("all");
  const [printing, setPrinting] = React.useState<SavedQuote | null>(null);

  const c = profile.currency || "USD";
  const store = getQuoteStore();

  const filtered = React.useMemo(
    () => (filter === "all" ? quotes : quotes.filter((q) => q.status === filter)),
    [quotes, filter],
  );

  async function changeStatus(q: SavedQuote, status: QuoteStatus) {
    try {
      await store.save({ ...q, status, updatedAt: new Date().toISOString() });
      await refreshQuotes();
      toast(`Marked ${status}`);
    } catch {
      toast("Could not update status");
    }
  }

  async function duplicate(q: SavedQuote) {
    try {
      const copy: SavedQuote = {
        id: uid(),
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        quotation: q.quotation,
      };
      await store.save(copy);
      await refreshQuotes();
      toast("Duplicated as draft");
    } catch {
      toast("Could not duplicate");
    }
  }

  async function remove(q: SavedQuote) {
    try {
      await store.remove(q.id);
      await refreshQuotes();
      toast("Quote deleted");
    } catch {
      toast("Could not delete");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps">Library</p>
          <h1 className="mt-1 font-display text-4xl">Quotes</h1>
          <p className="mt-2 text-ink-soft">
            {quotes.length} saved {quotes.length === 1 ? "quote" : "quotes"}.
          </p>
        </div>
        <Button onClick={() => startNew()}>
          <PlusCircle className="h-4 w-4" /> New Quote
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No quotes here yet"
          description="Create a quote from a template or start from scratch."
          action={
            <Button onClick={() => startNew()}>
              <PlusCircle className="h-4 w-4" /> New Quote
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((q) => {
            const Icon = STATUS_ICON[q.status];
            return (
              <Card key={q.id} className="flex flex-col overflow-hidden">
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: statusColor(q.status) }}
                  aria-hidden
                />
                <CardContent className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {q.quotation?.projectTitle || "Untitled quote"}
                      </p>
                      <p className="truncate text-xs text-ink-soft">
                        {q.quotation?.clientName || "No client"}
                      </p>
                    </div>
                    <StatusBadge status={q.status} />
                  </div>

                  <p className="mt-4 font-display text-2xl">
                    {money(Number(q.quotation?.total) || 0, c)}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    Updated {new Date(q.updatedAt).toLocaleDateString()}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => editQuote(q)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPrinting(q)}>
                      <Printer className="h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => duplicate(q)}>
                      <Copy className="h-4 w-4" /> Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => remove(q)}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="label-caps">Status</span>
                    <div className="flex flex-1 flex-wrap gap-1">
                      {(["draft", "sent", "accepted", "declined"] as QuoteStatus[]).map((s) => (
                        <button
                          key={s}
                          title={`Mark ${s}`}
                          onClick={() => changeStatus(q, s)}
                          className={
                            "rounded-md p-1.5 transition-colors hover:bg-accent/10 " +
                            (q.status === s ? "ring-2 ring-accent/40" : "opacity-60")
                          }
                        >
                          {React.createElement(STATUS_ICON[s], {
                            className: "h-4 w-4",
                            style: { color: statusColor(s) },
                          })}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {printing && (
        <PrintSheet
          quote={printing.quotation}
          profile={profile}
          number={`Q-${printing.id.slice(0, 6).toUpperCase()}`}
          onClose={() => setPrinting(null)}
        />
      )}
    </div>
  );
}
