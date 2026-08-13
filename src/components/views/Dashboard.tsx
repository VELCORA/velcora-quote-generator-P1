import { useMemo } from "react";
import { useApp } from "@/lib/app-context";
import { StatCard } from "@/components/quote/StatCard";
import { StatusDonut } from "@/components/quote/StatusDonut";
import { StatusBadge } from "@/components/quote/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { money } from "@/lib/quote-store";
import type { QuoteStatus } from "@/lib/storage-types";
import {
  FileText,
  CheckCircle2,
  Clock,
  DollarSign,
  PlusCircle,
  LayoutTemplate,
  ArrowRight,
} from "lucide-react";

const ORDER: QuoteStatus[] = ["draft", "sent", "accepted", "declined"];

export function Dashboard() {
  const { quotes, profile, startNew, setView, editQuote } = useApp();
  const c = profile.currency || "USD";

  const stats = useMemo(() => {
    const total = quotes.length;
    const accepted = quotes.filter((q) => q.status === "accepted").length;
    const pending = quotes.filter((q) => q.status === "sent" || q.status === "draft").length;
    const value = quotes.reduce((s, q) => s + (Number(q.quotation?.total) || 0), 0);
    return { total, accepted, pending, value };
  }, [quotes]);

  const donut = useMemo(
    () =>
      ORDER.map((status) => ({
        status,
        count: quotes.filter((q) => q.status === status).length,
      })),
    [quotes],
  );

  const recent = useMemo(
    () =>
      [...quotes]
        .sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""))
        .slice(0, 5),
    [quotes],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps">Overview</p>
          <h1 className="mt-1 font-display text-4xl">Dashboard</h1>
          <p className="mt-2 text-ink-soft">
            Track every quote, from draft to accepted deal.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => startNew()}>
            <PlusCircle className="h-4 w-4" /> New Quote
          </Button>
          <Button variant="outline" onClick={() => setView("templates")}>
            <LayoutTemplate className="h-4 w-4" /> Templates
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total quotes" value={stats.total} icon={FileText} />
        <StatCard
          title="Accepted"
          value={stats.accepted}
          icon={CheckCircle2}
          accent
          hint="Won deals"
        />
        <StatCard
          title="In pipeline"
          value={stats.pending}
          icon={Clock}
          hint="Draft + sent"
        />
        <StatCard
          title="Total value"
          value={money(stats.value, c)}
          icon={DollarSign}
          hint="Across all quotes"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Status mix</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <p className="py-10 text-center text-sm text-ink-soft">
                No quotes yet. Create your first one.
              </p>
            ) : (
              <StatusDonut data={donut} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-soft">
                Nothing here yet.
              </p>
            ) : (
              <ul className="divide-y divide-paper-line">
                {recent.map((q) => (
                  <li key={q.id}>
                    <button
                      onClick={() => editQuote(q)}
                      className="flex w-full items-center gap-4 py-3 text-left transition-colors hover:bg-accent/5"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-accent" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">
                          {q.quotation?.projectTitle || "Untitled quote"}
                        </p>
                        <p className="truncate text-xs text-ink-soft">
                          {q.quotation?.clientName || "No client"} ·{" "}
                          {new Date(q.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <StatusBadge status={q.status} />
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-soft" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
