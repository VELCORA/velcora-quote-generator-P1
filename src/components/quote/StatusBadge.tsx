import { Badge } from "@/components/ui/badge";
import type { QuoteStatus } from "@/lib/storage-types";
import { cn } from "@/lib/utils";

const MAP: Record<QuoteStatus, string> = {
  draft: "border-dashed border-paper-line text-ink-soft",
  sent: "border-accent/40 bg-accent/10 text-accent",
  accepted: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  declined: "border-destructive/40 bg-destructive/10 text-destructive",
};

const LABEL: Record<QuoteStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  accepted: "Accepted",
  declined: "Declined",
};

export function StatusBadge({
  status,
  className,
}: {
  status: QuoteStatus;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(MAP[status], className)}>
      {LABEL[status]}
    </Badge>
  );
}

export function statusColor(status: QuoteStatus): string {
  switch (status) {
    case "accepted":
      return "#10b981";
    case "sent":
      return "#c08a2e";
    case "declined":
      return "#b42318";
    default:
      return "#9a948a";
  }
}
